import { User } from '../models/User';

export class UserService {
  private static instance: UserService;
  private baseUrl = 'https://jsonplaceholder.typicode.com/users';

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async fetchUsers(): Promise<User[]> {
    const response = await fetch(this.baseUrl);
    const data = await response.json();
    return data.map((user: any) => ({
      ...user,
      directorFullName: user.name,
    }));
  }

  async deleteUser(id: number): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  }

  async updateUser(user: User): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    return response.ok;
  }

  async addUser(user: Omit<User, 'id'>): Promise<User> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    return response.json();
  }
}
