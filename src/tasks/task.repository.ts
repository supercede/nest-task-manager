import { Repository, EntityRepository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './taskstatus-enum';
import { FilterTaskDto } from './dto/get-task-filter.dto';
import { User } from 'src/auth/user.entity';

@EntityRepository(Task)
export class TaskReposity extends Repository<Task> {
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;

    await task.save();

    delete task.user.password;
    delete task.user.salt;
    delete task.user.tasks;

    return task;
  }

  async getTasks(filterTaskDto: FilterTaskDto): Promise<Task[]> {
    const { search, status } = filterTaskDto;

    const query = this.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();

    return tasks;
  }
}
