import { Transform, Expose } from 'class-transformer';

export enum ThreadStatus {
  PUBLISHED = 'published',
  DELETED = 'deleted',
  DRAFT = 'draft',
}

export class ThreadDto {
  @Expose()
  id: string;

  @Expose()
  status: ThreadStatus;

  @Expose()
  title: string;

  @Expose()
  content: string;

  @Expose()
  image_url: string;

  @Expose()
  topics: string;

  @Expose()
  created_at: string;

  @Expose()
  updated_at: string;

  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;
}
