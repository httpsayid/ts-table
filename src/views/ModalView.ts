import { UserStore } from '../store/UserStore';
import { User } from '../models/User';

export class ModalView {
  private store: UserStore;
  private modal: HTMLElement | null = null;

  constructor() {
    this.store = UserStore.getInstance();
    this.store.on('modalStateChanged', this.render);
    this.setupModal();
  }

  private setupModal() {
    this.modal = document.createElement('div');
    this.modal.id = 'modal';
    this.modal.className = 'hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    document.body.appendChild(this.modal);
  }

  render = () => {
    if (!this.modal) return;

    if (this.store.getIsModalOpen()) {
      const currentUser = this.store.getCurrentUser();
      this.modal.classList.remove('hidden');

      this.modal.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
          <h2 class="text-xl font-bold mb-4">
            ${this.store.getIsEditMode() ? 'Редактировать организацию' : 'Добавить организацию'}
          </h2>
          <form id="user-form" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Название</label>
              <input
                name="companyName"
                value="${currentUser?.company.name || ''}"
                required
                class="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">ФИО директора</label>
              <input
                name="directorFullName"
                value="${currentUser?.directorFullName || ''}"
                required
                class="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Телефон</label>
              <input
                name="phone"
                value="${currentUser?.phone || ''}"
                required
                class="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Город</label>
              <input
                name="city"
                value="${currentUser?.address.city || ''}"
                required
                class="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Улица</label>
              <input
                name="street"
                value="${currentUser?.address.street || ''}"
                required
                class="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Дом</label>
              <input
                name="suite"
                value="${currentUser?.address.suite || ''}"
                required
                class="w-full p-2 border rounded"
              />
            </div>
            <div class="flex justify-end space-x-2">
              <button
                type="button"
                id="cancel-btn"
                class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Отмена
              </button>
              <button
                type="submit"
                id="submit-btn"
                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
              >
                OK
              </button>
            </div>
          </form>
        </div>
      `;

      this.setupFormListeners(currentUser);
    } else {
      this.modal.classList.add('hidden');
    }
  };

  private setupFormListeners(currentUser: User | null) {
    const form = document.getElementById('user-form');
    const cancelBtn = document.getElementById('cancel-btn');
    const submitBtn = document.getElementById('submit-btn');

    if (!form || !cancelBtn || !submitBtn) return;

    cancelBtn.addEventListener('click', () => {
      this.store.closeModal();
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form as HTMLFormElement);
      const userData = {
        id: currentUser?.id || Date.now(),
        name: formData.get('directorFullName') as string,
        username: currentUser?.username || '',
        email: currentUser?.email || '',
        phone: formData.get('phone') as string,
        address: {
          city: formData.get('city') as string,
          street: formData.get('street') as string,
          suite: formData.get('suite') as string,
        },
        company: {
          name: formData.get('companyName') as string,
        },
        directorFullName: formData.get('directorFullName') as string,
      };

      if (this.store.getIsEditMode() && currentUser) {
        this.store.updateUser({ ...userData, id: currentUser.id });
      } else {
        this.store.addUser(userData);
      }
    });
  }
}
