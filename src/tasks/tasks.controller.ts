import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  HttpCode,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './taskstatus-enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/get-task-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status.pipe';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('Task Controller');

  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query(ValidationPipe) filterTaskDto: FilterTaskDto,
    @GetUser() user: User,
  ) {
    this.logger.verbose(
      `Getting all tasks for ${user.username}, with filter ${JSON.stringify(
        filterTaskDto,
      )}`,
    );
    return this.tasksService.getTasks(filterTaskDto, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `Creating task ${JSON.stringify(createTaskDto)} for user ${
        user.username
      }`,
    );
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Get('/:id')
  getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @Delete('/:id')
  @HttpCode(204)
  deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.tasksService.deleteTask(id, user);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(id, status, user);
  }
}
