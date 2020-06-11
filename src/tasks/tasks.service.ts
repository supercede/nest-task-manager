import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './taskstatus-enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/get-task-filter.dto';
import { TaskReposity } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskReposity)
    private taskRespository: TaskReposity,
  ) {}

  async getTasks(
    filterTaskDto: FilterTaskDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    return this.taskRespository.getTasks(filterTaskDto, user);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const task = await this.taskRespository.findOne({
      where: { id, userId: user.id },
    });

    if (!task) {
      throw new NotFoundException('Task Not Found');
    }
    return task;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User) {
    return this.taskRespository.createTask(createTaskDto, user);
  }

  async deleteTask(id: number, user: User): Promise<void> {
    const result = await this.taskRespository.delete({ id, userId: user.id });

    if (result.affected === 0) {
      throw new NotFoundException('Task Not Found');
    }
  }

  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);

    task.status = status;

    await task.save();
    return task;
  }
}
