import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Thread } from './thread.entity';
import { CreateThreadDto } from './dtos/create-thread.dto';
import { User } from '../users/user.entity';
import { ThreadStatus } from './dtos/thread.dto';
import { TopicsService } from '../topics/topics.service';

@Injectable()
export class ThreadsService {
  constructor(@InjectRepository(Thread) private repo: Repository<Thread>) {}

  async create(threadDto: CreateThreadDto, user: User) {
    const thread = await this.repo.create(threadDto);
    thread.user = user;
    return await this.repo.save(thread);
  }

  async findOne(id: number) {
    const thread = await this.repo.findOne({ id }, { relations: ['user'] });
    if (!id || !thread) {
      throw new NotFoundException('thread not found');
    }
    delete thread.user.password;
    return thread;
  }

  async changeApproval(id: number, status: string) {
    const thread = await this.findOne(id);

    Object.assign(thread, { status });
    return await this.repo.save(thread);
  }

  async find({ status, topic }) {
    const options = {
      relations: ['user'],
      take: 10, // TODO add pagination
      skip: 0,
    };

    const threads = await this.repo
      .createQueryBuilder('thread')
      .leftJoinAndSelect('thread.user', 'user');
    if (status) threads.where('status = :status', { status });
    return await threads.getMany();
  }

  async update(id: number, attrs: Partial<Thread>) {
    const thread = await this.findOne(id);
    if (!thread) {
      throw new NotFoundException();
    }

    Object.assign(thread, attrs);
    return await this.repo.save(thread);
  }

  async remove(id: number) {
    const thread = await this.findOne(id);
    if (!thread) {
      throw new NotFoundException();
    }

    Object.assign(thread, { status: ThreadStatus.DELETED });
    return await this.repo.save(thread);
  }
}
