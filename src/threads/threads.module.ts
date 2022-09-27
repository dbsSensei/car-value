import { Module } from '@nestjs/common';
import { ThreadsController } from './threads.controller';
import { ThreadsService } from './threads.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Thread } from './thread.entity';
import { TopicsService } from '../topics/topics.service';
import { Topic } from '../topics/topic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Thread, Topic])],
  controllers: [ThreadsController],
  providers: [ThreadsService, TopicsService],
  exports: [ThreadsService],
})
export class ThreadsModule {}
