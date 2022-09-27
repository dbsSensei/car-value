import { Test, TestingModule } from '@nestjs/testing';
import { ThreadsController } from './threads.controller';
import { ThreadsService } from './threads.service';
import { Thread } from './thread.entity';
import { TopicsService } from '../topics/topics.service';
import { Topic } from '../topics/topic.entity';

describe('ThreadsController', () => {
  let controller: ThreadsController;
  let fakeThreadsService: Partial<ThreadsService>;
  let fakeTopicsService: Partial<TopicsService>;

  beforeEach(async () => {
    fakeThreadsService = {
      async find(): Promise<Thread[]> {
        return Promise.resolve([]);
      },
    };
    fakeTopicsService = {
      async find(): Promise<Topic[]> {
        return Promise.resolve([]);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThreadsController],
      providers: [
        {
          provide: ThreadsService,
          useValue: fakeThreadsService,
        },
        {
          provide: TopicsService,
          useValue: fakeTopicsService,
        },
      ],
    }).compile();

    controller = module.get<ThreadsController>(ThreadsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
