import { IsNumber, IsString } from 'class-validator';

export class CreateTopicDto {
  @IsString()
  name: string;

  @IsNumber()
  value: number;
}
