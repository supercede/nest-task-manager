import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskReposity } from './task.repository';

@Module({
  // typeorm repository - injection
  imports: [TypeOrmModule.forFeature([TaskReposity])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
