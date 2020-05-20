import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {};

    @Get()
    getAllTasks() : Task[] {
        return this.tasksService.getAllTasks();
    }

    @Post()
    createTask(@Body() createTaskDto: CreateTaskDto) {        
        return this.tasksService.createTask(createTaskDto);
    }

    @Get('/:id')
    getTaskById(@Param('id') id: string): Task {        
        return this.tasksService.getTaskById(id);
    }

    @Delete('/:id')
    deleteTask(@Param('id') id: string): void {
        this.tasksService.deleteTask(id);
    }
}
