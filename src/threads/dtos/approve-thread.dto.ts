import { IsString } from 'class-validator';
import { ThreadStatus } from './thread.dto';

export class ApproveThreadDto {
  @IsString()
  status: ThreadStatus;
}
