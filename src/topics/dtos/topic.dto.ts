import { Transform, Expose } from 'class-transformer';

export class TopicDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  value: number;

  @Expose()
  created_at: string;

  @Transform(({ obj }) => obj.threads.id)
  @Expose()
  threadId: number;
}
