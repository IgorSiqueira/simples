import { User } from '../models/User';

export class ConsoleView {
  displayUsers(users: User[]): void {
    console.log('\n=== Lista de Usuários ===');
    if (users.length === 0) {
      console.log('Nenhum usuário cadastrado.');
      return;
    }
    users.forEach(u => {
      console.log(`ID: ${u.id} | Nome: ${u.name} | Email: ${u.email}`);
    });
  }

  displayUser(user: User): void {
    console.log('\n=== Usuário ===');
    console.log(`ID: ${user.id} | Nome: ${user.name} | Email: ${user.email}`);
  }

  displaySuccess(message: string): void {
    console.log(`\n✓ ${message}`);
  }

  displayError(message: string): void {
    console.log(`\n✗ Erro: ${message}`);
  }
}
