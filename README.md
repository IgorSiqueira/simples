📚 Entendendo Interface e Service - Guia para Júnior
🎯 O que é uma INTERFACE?
Analogia do Mundo Real
Imagine que você vai comprar um celular. Você não precisa saber como o celular funciona por dentro (circuitos, processador, etc). Você só precisa saber:

Tem botão de ligar/desligar
Tem tela touch
Tem câmera
Tem entrada USB

A interface é como um contrato ou manual de instruções. Ela diz O QUE um objeto deve fazer, mas não diz COMO ele faz.
Exemplo Simples - Interface de Repositório
typescript// ❌ SEM INTERFACE (código rígido)
class UserRepository {
  saveToDatabase(user: User) {
    // salva no MySQL
  }
}

const repo = new UserRepository();
repo.saveToDatabase(user);
// E se eu quiser mudar para MongoDB? Tenho que mudar todo código!
typescript// ✅ COM INTERFACE (código flexível)
interface IUserRepository {
  save(user: User): void;
  findById(id: number): User | undefined;
}

// Implementação 1: MySQL
class MySQLUserRepository implements IUserRepository {
  save(user: User): void {
    console.log('Salvando no MySQL...');
  }
  
  findById(id: number): User | undefined {
    console.log('Buscando no MySQL...');
    return new User(id, 'João', 'joao@email.com');
  }
}

// Implementação 2: MongoDB
class MongoDBUserRepository implements IUserRepository {
  save(user: User): void {
    console.log('Salvando no MongoDB...');
  }
  
  findById(id: number): User | undefined {
    console.log('Buscando no MongoDB...');
    return new User(id, 'Maria', 'maria@email.com');
  }
}

// Implementação 3: Memória (para testes)
class InMemoryUserRepository implements IUserRepository {
  private users: User[] = [];
  
  save(user: User): void {
    console.log('Salvando na memória...');
    this.users.push(user);
  }
  
  findById(id: number): User | undefined {
    console.log('Buscando na memória...');
    return this.users.find(u => u.id === id);
  }
}
🎁 Vantagens da Interface

Flexibilidade: Posso trocar MySQL por MongoDB sem quebrar o código
Testes: Posso usar uma versão "fake" para testar
Trabalho em equipe: Defino a interface e cada dev faz uma implementação
Clareza: Fica claro o que a classe deve fazer


🔧 O que é um SERVICE?
Analogia do Mundo Real
Imagine um restaurante:

Garçom (Controller): Recebe o pedido do cliente
Cozinheiro (Service): Prepara a comida com as regras corretas
Despensa (Repository): Guarda os ingredientes

O Service é o cérebro da aplicação. Ele tem as regras de negócio.
Exemplo Simples - Service de Usuário
typescript// ❌ SEM SERVICE (Controller fazendo tudo - ERRADO!)
class UserController {
  createUser(name: string, email: string) {
    // Validação direto no controller? NÃO!
    if (!name || name.length < 3) {
      throw new Error('Nome inválido');
    }
    
    if (!email.includes('@')) {
      throw new Error('Email inválido');
    }
    
    // Salvando direto? NÃO!
    const user = new User(1, name, email);
    database.save(user);
    
    // Enviando email direto? NÃO!
    sendWelcomeEmail(email);
  }
}
// Problema: Controller está fazendo TUDO. Difícil de testar e manter!
typescript// ✅ COM SERVICE (Separação correta - CERTO!)
class UserService {
  constructor(
    private repository: IUserRepository,
    private emailService: IEmailService
  ) {}
  
  createUser(name: string, email: string): User {
    // 1. VALIDAÇÕES (regras de negócio)
    this.validateName(name);
    this.validateEmail(email);
    
    // 2. VERIFICAR SE JÁ EXISTE
    const existingUser = this.repository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email já cadastrado');
    }
    
    // 3. CRIAR USUÁRIO
    const user = this.repository.create(name, email);
    
    // 4. ENVIAR EMAIL DE BOAS-VINDAS
    this.emailService.sendWelcome(email);
    
    // 5. REGISTRAR LOG
    console.log(`Novo usuário criado: ${user.name}`);
    
    return user;
  }
  
  private validateName(name: string): void {
    if (!name || name.trim().length < 3) {
      throw new Error('Nome deve ter no mínimo 3 caracteres');
    }
  }
  
  private validateEmail(email: string): void {
    if (!email || !email.includes('@')) {
      throw new Error('Email inválido');
    }
  }
}
🎁 Vantagens do Service

Centraliza as regras de negócio: Todas as validações em um lugar
Reutilizável: Posso usar o service em diferentes controllers (Web, Mobile, API)
Testável: Fácil de testar as regras isoladamente
Manutenível: Se mudar uma regra, mudo em um só lugar


🔄 Como Interface e Service Trabalham Juntos
Exemplo Completo e Prático
typescript// 1️⃣ INTERFACE (O contrato)
interface IUserRepository {
  create(name: string, email: string): User;
  findByEmail(email: string): User | undefined;
  findAll(): User[];
}

interface IEmailService {
  sendWelcome(email: string): void;
}

// 2️⃣ IMPLEMENTAÇÕES
class InMemoryUserRepository implements IUserRepository {
  private users: User[] = [];
  private nextId = 1;
  
  create(name: string, email: string): User {
    const user = new User(this.nextId++, name, email);
    this.users.push(user);
    return user;
  }
  
  findByEmail(email: string): User | undefined {
    return this.users.find(u => u.email === email);
  }
  
  findAll(): User[] {
    return [...this.users];
  }
}

class ConsoleEmailService implements IEmailService {
  sendWelcome(email: string): void {
    console.log(`📧 Email de boas-vindas enviado para: ${email}`);
  }
}

// 3️⃣ SERVICE (Regras de negócio)
class UserService {
  constructor(
    private userRepo: IUserRepository,
    private emailService: IEmailService
  ) {}
  
  registerUser(name: string, email: string): User {
    // Validar
    if (!name || name.length < 3) {
      throw new Error('Nome deve ter no mínimo 3 caracteres');
    }
    
    if (!email.includes('@')) {
      throw new Error('Email inválido');
    }
    
    // Verificar duplicidade
    const existing = this.userRepo.findByEmail(email);
    if (existing) {
      throw new Error('Email já cadastrado');
    }
    
    // Criar
    const user = this.userRepo.create(name, email);
    
    // Enviar email
    this.emailService.sendWelcome(email);
    
    return user;
  }
  
  listAllUsers(): User[] {
    return this.userRepo.findAll();
  }
}

// 4️⃣ CONTROLLER (Coordena tudo)
class UserController {
  constructor(private service: UserService) {}
  
  handleRegister(name: string, email: string): void {
    try {
      const user = this.service.registerUser(name, email);
      console.log(`✅ Usuário criado: ${user.name}`);
    } catch (error) {
      console.log(`❌ Erro: ${error.message}`);
    }
  }
  
  handleListUsers(): void {
    const users = this.service.listAllUsers();
    console.log('📋 Usuários:', users);
  }
}

// 5️⃣ INICIALIZAÇÃO (Injeção de Dependências)
const userRepo = new InMemoryUserRepository();
const emailService = new ConsoleEmailService();
const userService = new UserService(userRepo, emailService);
const userController = new UserController(userService);

// 6️⃣ USO
userController.handleRegister('João Silva', 'joao@email.com');
userController.handleRegister('Maria', 'm'); // ❌ Erro: Nome e email inválidos
userController.handleRegister('João Silva', 'joao@email.com'); // ❌ Erro: Duplicado
userController.handleListUsers();

📊 Comparação Visual
❌ Sem Interface e Service (Código Acoplado)
Controller
    ↓ (chama diretamente)
MySQLDatabase
    ↓
EmailAPI
Problema: Se mudar MySQL para MongoDB, quebra tudo!
✅ Com Interface e Service (Código Desacoplado)
Controller
    ↓
Service (regras de negócio)
    ↓
IRepository (interface)
    ↓
MySQLRepo OU MongoRepo OU InMemoryRepo
Vantagem: Posso trocar a implementação sem quebrar nada!

🎯 Resumo para Gravar
ConceitoO que é?ResponsabilidadeInterfaceContrato/ManualDefine O QUE deve ser feitoServiceCérebro/CozinhaDefine COMO e QUANDO fazer (regras)RepositoryDespensa/ArmazémGuarda e busca dadosControllerGarçom/AtendenteRecebe pedidos e coordena

💡 Dica de Ouro
Pergunta mágica: "Se eu mudar o banco de dados, quantos arquivos preciso alterar?"

❌ Sem interface: Muitos arquivos (RUIM)
✅ Com interface: Apenas 1 arquivo - a implementação do repository (BOM)

Interface = Facilidade de mudança no futuro!
