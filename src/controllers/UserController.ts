import { UserService } from '../services/UserService';
import { ConsoleView } from '../views/ConsoleView';

export class UserController {
  constructor(
    private service: UserService,
    private view: ConsoleView
  ) {}

  listUsers(): void {
    const users = this.service.getAllUsers();
    this.view.displayUsers(users);
  }

  getUser(id: number): void {
    const user = this.service.getUserById(id);
    if (user) {
      this.view.displayUser(user);
    } else {
      this.view.displayError(`Usuário com ID ${id} não encontrado`);
    }
  }

  createUser(name: string, email: string): void {
    try {
      const user = this.service.createUser(name, email);
      this.view.displaySuccess(`Usuário criado: ${user.name}`);
    } catch (error) {
      this.view.displayError((error as Error).message);
    }
  }

  updateUser(id: number, name: string, email: string): void {
    try {
      const user = this.service.updateUser(id, name, email);
      if (user) {
        this.view.displaySuccess(`Usuário atualizado: ${user.name}`);
      } else {
        this.view.displayError(`Usuário com ID ${id} não encontrado`);
      }
    } catch (error) {
      this.view.displayError((error as Error).message);
    }
  }

  deleteUser(id: number): void {
    const success = this.service.deleteUser(id);
    if (success) {
      this.view.displaySuccess(`Usuário deletado com sucesso`);
    } else {
      this.view.displayError(`Usuário com ID ${id} não encontrado`);
    }
  }
}
