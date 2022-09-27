import { IsString } from 'class-validator';

export class CreateThreadDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  image_url: string;

  @IsString()
  topics: string;
}
