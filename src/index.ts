import { InMemoryUserRepository } from './repositories/InMemoryUserRepository';
import { UserService } from './services/UserService';
import { ConsoleView } from './views/ConsoleView';
import { UserController } from './controllers/UserController';

// Configuração e inicialização (Dependency Injection)
const repository = new InMemoryUserRepository();
const service = new UserService(repository);
const view = new ConsoleView();
const controller = new UserController(service, view);

// Exemplos de uso
console.log('=== CRUD MVC + SOLID ===\n');

// CREATE
controller.createUser('João Silva', 'joao@email.com');
controller.createUser('Maria Santos', 'maria@email.com');
controller.createUser('Pedro Costa', 'pedro@email.com');

// READ (listar todos)
controller.listUsers();

// READ (buscar por ID)
controller.getUser(1);

// UPDATE
controller.updateUser(2, 'Maria Oliveira', 'maria.oliveira@email.com');

// READ (listar todos após update)
controller.listUsers();

// DELETE
controller.deleteUser(3);

// READ (listar todos após delete)
controller.listUsers();

// Tentar operações com dados inválidos
controller.createUser('', 'invalido@email.com');
controller.getUser(999);
