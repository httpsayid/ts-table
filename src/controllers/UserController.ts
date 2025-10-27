import { UserStore } from '../store/UserStore';
import { TableView } from '../views/TableView';
import { ModalView } from '../views/ModalView';
import { PaginationView } from '../views/PaginationView';
import { User } from '../models/User';

export class UserController {
  private store: UserStore;
  private tableView: TableView;
  private modalView: ModalView;
  private paginationView: PaginationView;

  constructor() {
    this.store = UserStore.getInstance();
    this.tableView = new TableView();
    this.modalView = new ModalView();
    this.paginationView = new PaginationView();

    this.setupEventListeners();
    this.store.fetchUsers();
  }

  private setupEventListeners() {
    document.querySelector('#add-btn')?.addEventListener('click', () => {
      this.store.openAddModal();
    });

    document.querySelector('#search-input')?.addEventListener('input', (e) => {
      const query = (e.target as HTMLInputElement).value;
      this.store.setSearchQuery(query);
    });

    document.querySelectorAll('th[data-sort]').forEach((th) => {
      th.addEventListener('click', () => {
        const field = th.getAttribute('data-sort') as keyof User;
        this.store.setSortField(field);
      });
    });
  }
}
