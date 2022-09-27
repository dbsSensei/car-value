import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Thread } from '../threads/thread.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  admin: boolean;

  @OneToMany(() => Thread, (thread) => thread.user)
  threads: Thread[];

  // @AfterInsert()
  // logInsert() {
  //   console.log('Inserted User with ID', this.id);
  // }
  //
  // @AfterUpdate()
  // logUpdate() {
  //   console.log('Updated User with ID', this.id);
  // }
  //
  // @AfterRemove()
  // logRemove() {
  //   console.log('Removed User with email', this.email);
  // }
}
