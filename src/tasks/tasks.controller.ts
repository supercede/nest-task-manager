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
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './taskstatus-enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/get-task-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status.pipe';
import { Task } from './task.entity';
import { DeleteResult } from 'typeorm';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  // @Get()
  // getTasks(@Query(ValidationPipe) filterTaskDto: FilterTaskDto): Task[] {
  //     if (Object.keys(filterTaskDto).length) {
  //         return this.tasksService.getFilteredTasks(filterTaskDto);
  //     }else {
  //         return this.tasksService.getAllTasks()
  //     }
  // }
  @Get()
  getTasks(@Query(ValidationPipe) filterTaskDto: FilterTaskDto) {
    return this.tasksService.getTasks(filterTaskDto);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }

  @Get('/:id')
  getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Delete('/:id')
  @HttpCode(204)
  deleteTask(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.tasksService.deleteTask(id);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(id, status);
  }
}
