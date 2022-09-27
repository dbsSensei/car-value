import { IsOptional, IsString } from 'class-validator';
import { ThreadStatus } from './thread.dto';

export class FilterThreadDto {
  @IsOptional()
  @IsString()
  status: ThreadStatus;

  @IsOptional()
  @IsString()
  topic: string;
}
