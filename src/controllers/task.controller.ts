import { Controller, Get, Post, Body } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateTaskCommand } from '../commands/create-task.command';
import { GetTasksQuery } from '../queries/get-tasks.query';

@Controller('tasks')
export class TaskController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post()
  async createTask(
    @Body() body: { title: string; description: string },
  ): Promise<any> {
    return await this.commandBus.execute(
      new CreateTaskCommand(body.title, body.description),
    );
  }

  @Get()
  async getTasks() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.queryBus.execute(new GetTasksQuery());
  }
}
