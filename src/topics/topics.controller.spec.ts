import { Test, TestingModule } from '@nestjs/testing';
import { TopicsController } from './topics.controller';
import { TopicsService } from './topics.service';
import { Topic } from './topic.entity';

describe('TopicsController', () => {
  let controller: TopicsController;
  let fakeTopicsService: Partial<TopicsService>;

  beforeEach(async () => {
    fakeTopicsService = {
      async find(): Promise<Topic[]> {
        return Promise.resolve([]);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TopicsController],
      providers: [
        {
          provide: TopicsService,
          useValue: fakeTopicsService,
        },
      ],
    }).compile();

    controller = module.get<TopicsController>(TopicsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
