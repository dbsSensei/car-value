import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Topic } from './topic.entity';
import { CreateTopicDto } from './dtos/create-topic.dto';

@Injectable()
export class TopicsService {
  constructor(@InjectRepository(Topic) private repo: Repository<Topic>) {}

  async create(topicDto: CreateTopicDto) {
    const topic = await this.repo.create(topicDto);
    return await this.repo.save(topic);
  }

  async findOne(id: number) {
    const topic = await this.repo.findOne({ id });
    if (!id || !topic) {
      throw new NotFoundException('topic not found');
    }
    return topic;
  }

  async incrementTopicValue(id: number) {
    const topic = await this.findOne(id);

    Object.assign(topic, { value: topic.value + 1 });
    return await this.repo.save(topic);
  }

  async find(name) {
    const topics = await this.repo.find({
      order: {
        value: 'DESC',
      },
      take: 10,
    });

    return topics;
  }
}
