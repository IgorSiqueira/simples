import { User } from '../models/User';

export interface IUserRepository {
  findAll(): User[];
  findById(id: number): User | undefined;
  create(name: string, email: string): User;
  update(id: number, name: string, email: string): User | undefined;
  delete(id: number): boolean;
}
