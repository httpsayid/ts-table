import { UserStore } from '../store/UserStore';

export class PaginationView {
  private store: UserStore;

  constructor() {
    this.store = UserStore.getInstance();
    this.store.on('usersUpdated', this.render);
  }

  render = () => {
    const pagination = document.querySelector('#pagination');
    if (!pagination) return;

    const totalPages = this.store.totalPages;
    const currentPage = this.store['currentPage'];

    pagination.innerHTML = Array.from({ length: totalPages }, (_, i) => i + 1)
      .map(
        (page) => `
        <button
          class="px-3 py-1 mx-1 rounded ${
            currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }"
          data-page="${page}"
        >
          ${page}
        </button>
      `
      )
      .join('');

    this.setupEventListeners();
  };

  private setupEventListeners() {
    document.querySelectorAll('#pagination button').forEach((button) => {
      button.addEventListener('click', () => {
        const page = Number(button.getAttribute('data-page'));
        this.store.setCurrentPage(page);
      });
    });
  }
}
