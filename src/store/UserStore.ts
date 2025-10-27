import { User } from '../models/User';
import { EventEmitter } from '../utils/EventEmitter';
import { UserService } from '../services/UserService';

export class UserStore extends EventEmitter {
  private static instance: UserStore;
  private users: User[] = [];
  private filteredUsers: User[] = [];
  private currentPage = 1;
  private itemsPerPage = 5;
  private sortField: keyof User | null = null;
  private sortOrder: 'asc' | 'desc' | null = null;
  private searchQuery = '';
  private isModalOpen = false;
  private isEditMode = false;
  private currentUser: User | null = null;

  private constructor() {
    super();
  }

  public static getInstance(): UserStore {
    if (!UserStore.instance) {
      UserStore.instance = new UserStore();
    }
    return UserStore.instance;
  }

  async fetchUsers() {
    const userService = UserService.getInstance();
    this.users = await userService.fetchUsers();
    this.filteredUsers = [...this.users];
    this.emit('usersUpdated');
  }

  setSearchQuery(query: string) {
    this.searchQuery = query;
    this.filterUsers();
  }

  setSortField(field: keyof User) {
    if (this.sortField === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortOrder = 'asc';
    }
    this.filterUsers();
  }

  filterUsers() {
    let result = [...this.users];

    if (this.searchQuery) {
      result = result.filter((user) =>
        user.directorFullName?.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    if (this.sortField) {
      result.sort((a, b) => {
        const aValue = a[this.sortField!] as string;
        const bValue = b[this.sortField!] as string;
        if (aValue < bValue) return this.sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return this.sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    this.filteredUsers = result;
    this.currentPage = 1;
    this.emit('usersUpdated');
  }

  get paginatedUsers() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredUsers.slice(start, end);
  }

  get totalPages() {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  setCurrentPage(page: number) {
    this.currentPage = page;
    this.emit('usersUpdated');
  }

  openAddModal() {
    this.isEditMode = false;
    this.currentUser = {
      id: Date.now(),
      name: '',
      username: '',
      email: '',
      phone: '',
      address: {
        city: '',
        street: '',
        suite: '',
      },
      company: {
        name: '',
      },
      directorFullName: '',
    };
    this.isModalOpen = true;
    this.emit('modalStateChanged');
  }

  openEditModal(user: User) {
    this.isEditMode = true;
    this.currentUser = { ...user };
    this.isModalOpen = true;
    this.emit('modalStateChanged');
  }

  closeModal() {
    this.isModalOpen = false;
    this.emit('modalStateChanged');
  }

  async addUser(user: Omit<User, 'id'>) {
    const userService = UserService.getInstance();
    const newUser = await userService.addUser(user);
    this.users.push(newUser);
    this.filterUsers();
    this.closeModal();
  }

  async updateUser(user: User) {
    const userService = UserService.getInstance();
    const success = await userService.updateUser(user);
    if (success) {
      const index = this.users.findIndex((u) => u.id === user.id);
      if (index !== -1) {
        this.users[index] = user;
        this.filterUsers();
      }
      this.closeModal();
    }
  }

  async deleteUser(id: number) {
    const userService = UserService.getInstance();
    const success = await userService.deleteUser(id);
    if (success) {
      this.users = this.users.filter((user) => user.id !== id);
      this.filterUsers();
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getIsModalOpen(): boolean {
    return this.isModalOpen;
  }

  getIsEditMode(): boolean {
    return this.isEditMode;
  }
}
