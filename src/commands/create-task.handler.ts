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
