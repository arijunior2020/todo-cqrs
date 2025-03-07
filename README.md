<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# 📌 Padrão CQRS: O que é, Vantagens e Implementação Prática no NestJS

## 📖 Introdução ao CQRS

O CQRS (Command Query Responsibility Segregation) é um padrão arquitetural que separa as operações de escrita (commands) e leitura (queries) em um sistema. Ele é frequentemente usado em sistemas distribuídos, garantindo maior escalabilidade e organização do código.

🔹 Como Funciona o CQRS?
Em uma aplicação tradicional, temos uma única interface para criar, ler, atualizar e deletar dados (CRUD). No CQRS, essa abordagem é separada em dois modelos diferentes:

- Commands (Comandos) → Escrita: Operações que modificam os dados, como criar, atualizar ou deletar.
- Queries (Consultas) → Leitura: Operações que buscam os dados sem modificá-los.

Isso permite que as operações de leitura e escrita sejam otimizadas separadamente, melhorando a performance em sistemas complexos.

# 📌 Vantagens e Desvantagens do CQRS

✅ Vantagens do CQRS
Melhor desempenho: Como leitura e escrita são separadas, cada uma pode ser otimizada individualmente.
Escalabilidade: Permite escalar consultas e comandos separadamente (ex: replicação de bancos de leitura).
Segurança e controle: Comandos podem ter regras específicas sem afetar as consultas.
Código mais organizado: Cada responsabilidade tem sua própria lógica, evitando grandes repositórios monolíticos.

❌ Desvantagens do CQRS
Aumento da complexidade: Para aplicações simples, CQRS pode ser um "exagero" desnecessário.
Mais código e camadas: O sistema terá mais classes (Commands, Handlers, Queries, Events).
Sincronização de dados: Se leitura e escrita forem separadas em bancos distintos, manter a consistência pode ser um desafio.

# 📌 Quando Usar CQRS?

💡 Indicado para:
✅ Sistemas de alta escalabilidade → Quando há muitas operações de leitura e escrita concorrentes. ✅ Aplicações Event-Driven → Quando precisamos processar eventos e reações a comandos. ✅ Domínios complexos (DDD) → Quando diferentes regras de negócio governam leitura e escrita.

# 🚫 Evitar CQRS em:

❌ Aplicações CRUD simples → Se o sistema tem apenas operações básicas, CQRS pode ser um exagero. ❌ Projetos pequenos → A separação de leitura e escrita pode dificultar a manutenção sem necessidade.

📌 Laboratório Prático: Implementando CQRS com NestJS
Agora que entendemos o CQRS, vamos implementá-lo na prática usando NestJS e TypeORM com SQLite.

📌 O que vamos criar?
Uma API simples para gerenciar tarefas (To-Do List) com:

Comandos (Commands) para criação de tarefas.
Consultas (Queries) para listar todas as tarefas.
Banco de dados SQLite com TypeORM.

## 1️⃣ Criando o Projeto NestJS

Se ainda não tem o NestJS instalado, rode:

bash
`npm i -g @nestjs/cli`

### Agora, crie um novo projeto:

```
nest new todo-cqrs
cd todo-cqrs
npm install
```

### Instale as dependências necessárias:

bash
`npm install @nestjs/cqrs @nestjs/typeorm typeorm sqlite3`

## 2️⃣ Configurando o Banco de Dados

Agora, vamos configurar o TypeORM para conectar ao banco de dados SQLite.

📌 Abra src/app.module.ts e configure o banco:

bash

```
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { Task } from './models/task.entity';
import { TaskRepository } from './repositories/task.repository';
import { CreateTaskHandler } from './commands/create-task.handler';
import { GetTasksHandler } from './queries/get-tasks.handler';
import { TaskController } from './controllers/task.controller';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [Task],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Task]),
  ],
  controllers: [TaskController],
  providers: [
    TaskRepository,
    CreateTaskHandler,
    GetTasksHandler,
  ],
})
export class AppModule {}
```

## 3️⃣ Criando a Entidade de Tarefa

📌 Crie src/models/task.entity.ts:

bash

```
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;
}
```

## 4️⃣ Criando o Repositório

📌 Crie src/repositories/task.repository.ts:

bash

```
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../models/task.entity';

@Injectable()
export class TaskRepository {
  constructor(@InjectRepository(Task) private readonly repo: Repository<Task>) {}

  async createTask(title: string, description: string): Promise<Task> {
    const task = this.repo.create({ title, description });
    return this.repo.save(task);
  }

  async getAllTasks(): Promise<Task[]> {
    return this.repo.find();
  }
}
```

## 5️⃣ Criando os Commands (Escrita)

📌 Crie src/commands/create-task.command.ts:

bash

```
import { ICommand } from '@nestjs/cqrs';

export class CreateTaskCommand implements ICommand {
  constructor(public readonly title: string, public readonly description: string) {}
}
```

📌 Crie src/commands/create-task.handler.ts:

bash

```
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTaskCommand } from './create-task.command';
import { TaskRepository } from '../repositories/task.repository';
import { Task } from '../models/task.entity';

@CommandHandler(CreateTaskCommand)
export class CreateTaskHandler implements ICommandHandler<CreateTaskCommand> {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(command: CreateTaskCommand): Promise<Task> {
    return this.taskRepository.createTask(command.title, command.description);
  }
}
```

## 6️⃣ Criando os Queries (Leitura)

📌 Crie src/queries/get-tasks.query.ts:

```
import { IQuery } from '@nestjs/cqrs';

export class GetTasksQuery implements IQuery {}
```

📌 Crie src/queries/get-tasks.handler.ts:

```
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTasksQuery } from './get-tasks.query';
import { TaskRepository } from '../repositories/task.repository';
import { Task } from '../models/task.entity';

@QueryHandler(GetTasksQuery)
export class GetTasksHandler implements IQueryHandler<GetTasksQuery> {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(): Promise<Task[]> {
    return await this.taskRepository.getAllTasks();
  }
}
```

## 7️⃣ Testando a API

`npm run start`

bash

```
curl -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title": "Aprender CQRS", "description": "Estudo prático"}'

curl -X GET http://localhost:3000/tasks
```
