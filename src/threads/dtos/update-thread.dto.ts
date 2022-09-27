import { IsString } from 'class-validator';

export class UpdateThreadDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  image_url: string;
}
