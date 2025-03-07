import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTasksQuery } from './get-tasks.query';
import { TaskRepository } from '../repositories/task.repository';
import { Task } from '../models/task.entity';

@QueryHandler(GetTasksQuery)
export class GetTasksHandler implements IQueryHandler<GetTasksQuery> {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(): Promise<Task[]> {
    return this.taskRepository.getAllTasks();
  }
}
