import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../models/task.entity';

@Injectable()
export class TaskRepository {
  constructor(
    @InjectRepository(Task) private readonly repo: Repository<Task>,
  ) {}

  async createTask(title: string, description: string): Promise<Task> {
    const task = this.repo.create({ title, description });
    return this.repo.save(task);
  }

  async getAllTasks(): Promise<Task[]> {
    return this.repo.find();
  }
}
