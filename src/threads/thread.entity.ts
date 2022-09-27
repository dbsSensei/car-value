import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { User } from '../users/user.entity';
import { ThreadStatus } from './dtos/thread.dto';
import { Topic } from '../topics/topic.entity';

@Entity()
export class Thread {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: ThreadStatus.DRAFT })
  status: ThreadStatus;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  image_url: string;

  @Column()
  topics: string;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at;

  @ManyToOne(() => User, (user) => user.threads)
  user: User;
}
