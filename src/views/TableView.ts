import { UserStore } from '../store/UserStore';
import { User } from '../models/User';

export class TableView {
  private store: UserStore;

  constructor() {
    this.store = UserStore.getInstance();
    this.store.on('usersUpdated', this.render);
  }

  render = () => {
    const tableBody = document.querySelector('#table-body');
    if (!tableBody) return;

    tableBody.innerHTML = this.store.paginatedUsers
      .map(
        (user: User) => `
        <tr class="hover:bg-gray-50 cursor-pointer" data-id="${user.id}">
          <td class="py-2 px-4 border">${user.company.name}</td>
          <td class="py-2 px-4 border">${user.directorFullName}</td>
          <td class="py-2 px-4 border">${user.phone}</td>
          <td class="py-2 px-4 border">
            ${user.address.city}, ${user.address.street}, ${user.address.suite}
          </td>
          <td class="py-2 px-4 border">
            <button class="delete-btn text-red-500 hover:text-red-700" data-id="${user.id}">❌</button>
          </td>
        </tr>
      `
      )
      .join('');

    this.setupEventListeners();
  };

  private setupEventListeners() {
    document.querySelectorAll('.delete-btn').forEach((button) => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = Number((e.target as HTMLElement).getAttribute('data-id'));
        this.store.deleteUser(id);
      });
    });

    document.querySelectorAll('#table-body tr').forEach((row) => {
      row.addEventListener('click', () => {
        const id = Number(row.getAttribute('data-id'));
        const user = this.store.paginatedUsers.find((u) => u.id === id);
        if (user) {
          this.store.openEditModal(user);
        }
      });
    });
  }
}
