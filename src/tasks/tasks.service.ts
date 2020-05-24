import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v1 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/get-task-filter.dto';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks() : Task[] {
        return this.tasks;
    }

    getFilteredTasks(filterTaskDto: FilterTaskDto) {
        const { status, search } = filterTaskDto;
        let tasks = this.getAllTasks();

        if(status) {
            tasks = tasks.filter(task => task.status.toLocaleLowerCase() === status.toLowerCase())
        }

        if(search) {
            tasks = tasks.filter( task => 
                task.title.toLowerCase().includes(search.toLowerCase()) ||
                task.description.toLowerCase().includes(search.toLowerCase())
            )
        }

        return tasks;
    }

    getTaskById(id: string) {
        const task = this.tasks.find(task => task.id === id);

        if(!task) {
            throw new NotFoundException('Task Not Found');
        }

        return task;
    }

    createTask(createTaskDto: CreateTaskDto) {
        const { title, description } = createTaskDto;
        const task: Task = {
            id: v1(),
            title,
            description,
            status: TaskStatus.OPEN,
        }

        this.tasks.push(task);
        return task;
    }

    deleteTask(id: string): void {
        const found = this.getTaskById(id);
        this.tasks = this.tasks.filter(task => task.id !== found.id);
    }

    updateTaskStatus(id: string, status: TaskStatus): Task {
        const task = this.getTaskById(id);
        task.status = status;
        return task;
    }
}
