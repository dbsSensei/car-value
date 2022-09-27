import { Test, TestingModule } from '@nestjs/testing';
import { TopicsService } from './topics.service';
import { User } from '../users/user.entity';
import { Topic } from './topic.entity';

describe('TopicsService', () => {
  let service: TopicsService;
  let fakeTopicsService: Partial<TopicsService>;

  beforeEach(async () => {
    fakeTopicsService = {
      async find(): Promise<Topic[]> {
        return Promise.resolve([]);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TopicsService,
        {
          provide: TopicsService,
          useValue: fakeTopicsService,
        },
      ],
    }).compile();

    service = module.get<TopicsService>(TopicsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
