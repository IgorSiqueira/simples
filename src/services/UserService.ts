import { User } from '../models/User';
import { IUserRepository } from '../repositories/IUserRepository';

export class UserService {
  constructor(private repository: IUserRepository) {}

  getAllUsers(): User[] {
    return this.repository.findAll();
  }

  getUserById(id: number): User | undefined {
    return this.repository.findById(id);
  }

  createUser(name: string, email: string): User {
    if (!name || !email) {
      throw new Error('Nome e email são obrigatórios');
    }
    return this.repository.create(name, email);
  }

  updateUser(id: number, name: string, email: string): User | undefined {
    if (!name || !email) {
      throw new Error('Nome e email são obrigatórios');
    }
    return this.repository.update(id, name, email);
  }

  deleteUser(id: number): boolean {
    return this.repository.delete(id);
  }
}
