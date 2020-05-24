import { TaskStatus } from '../taskstatus-enum';
import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';

export class FilterTaskDto {
  @IsOptional()
  @IsIn([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
