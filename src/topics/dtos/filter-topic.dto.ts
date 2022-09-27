import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FilterTopicDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsNumber()
  @IsOptional()
  value: number;
}
