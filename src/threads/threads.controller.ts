import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateThreadDto } from './dtos/create-thread.dto';
import { ThreadsService } from './threads.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ThreadDto, ThreadStatus } from './dtos/thread.dto';
import { ApproveThreadDto } from './dtos/approve-thread.dto';
import { AdminGuard } from '../guards/admin.guard';
import { UpdateThreadDto } from './dtos/update-thread.dto';
import { FilterThreadDto } from './dtos/filter-thread.dto';
import { TopicsService } from '../topics/topics.service';

@Controller('threads')
export class ThreadsController {
  constructor(
    private threadsService: ThreadsService,
    private topicsService: TopicsService,
  ) {}

  @Get('/:id')
  async getOneThread(@Param('id') id: string, @CurrentUser() user: User) {
    const thread = await this.threadsService.findOne(+id);

    if (user.admin) {
      return thread;
    }

    if (user.id === thread.user.id) {
      if (thread.status !== ThreadStatus.DELETED) {
        return thread;
      }
    }

    if (thread.status !== ThreadStatus.PUBLISHED) {
      throw new NotFoundException('thread not found');
    }

    return thread;
  }

  @Get('/')
  async getAllThreads(
    @Query() query: FilterThreadDto,
    @CurrentUser() user: User,
  ) {
    const threads = await this.threadsService.find(query);
    return threads
      .filter((thread) => {
        if (user?.admin) {
          return thread;
        }

        if (user.id === thread.user.id) {
          if (thread.status !== ThreadStatus.DELETED) {
            return thread;
          }
        }

        if (thread.status === ThreadStatus.PUBLISHED) {
          return thread;
        }
      })
      .map((thread) => {
        Object.assign(thread, { userId: thread.user.id });
        delete thread.user;
        return thread;
      });
  }

  @Post('/')
  @UseGuards(AuthGuard)
  @Serialize(ThreadDto)
  async createThread(@Body() body: CreateThreadDto, @CurrentUser() user: User) {
    await Promise.all(
      body.topics.split(',').map(async (topic) => {
        const existingTopic = await this.topicsService.find(topic);
        if (existingTopic.length) {
          await this.topicsService.incrementTopicValue(existingTopic[0].id);
          return;
        }
        await this.topicsService.create({ name: topic, value: 1 });
      }),
    );
    return this.threadsService.create(body, user);
  }

  @Patch('/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: UpdateThreadDto,
    @CurrentUser() user: User,
  ) {
    return await this.threadsService.update(+id, body);
  }

  @Patch('/status/:id')
  @UseGuards(AdminGuard)
  approveThread(@Param('id') id: string, @Body() body: ApproveThreadDto) {
    if (!Object.values(ThreadStatus).includes(body.status)) {
      throw new BadRequestException('invalid status');
    }
    return this.threadsService.changeApproval(+id, body.status);
  }

  @Delete('/:id')
  async deleteThread(@Param('id') id: string, @CurrentUser() user: User) {
    const thread = await this.threadsService.findOne(+id);
    if (user.id !== thread.user.id) {
      throw new BadRequestException(
        'only admin or owner user could remove this thread',
      );
    }

    return await this.threadsService.remove(+id);
  }
}
