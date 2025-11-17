import { User } from '../models/User';
import { IUserRepository } from './IUserRepository';

export class InMemoryUserRepository implements IUserRepository {
  private users: User[] = [];
  private nextId = 1;

  findAll(): User[] {
    return [...this.users];
  }

  findById(id: number): User | undefined {
    return this.users.find(u => u.id === id);
  }

  create(name: string, email: string): User {
    const user = new User(this.nextId++, name, email);
    this.users.push(user);
    return user;
  }

  update(id: number, name: string, email: string): User | undefined {
    const user = this.findById(id);
    if (user) {
      user.name = name;
      user.email = email;
      return user;
    }
    return undefined;
  }

  delete(id: number): boolean {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      return true;
    }
    return false;
  }
}
