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
  providers: [TaskRepository, CreateTaskHandler, GetTasksHandler],
})
export class AppModule {}
