import { Test, TestingModule } from '@nestjs/testing';
import { ThreadsService } from './threads.service';
import { Thread } from './thread.entity';

describe('ThreadsService', () => {
  let service: ThreadsService;
  let fakeThreadsService: Partial<ThreadsService>;
  beforeEach(async () => {
    fakeThreadsService = {
      async find(): Promise<Thread[]> {
        return Promise.resolve([]);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ThreadsService,
        {
          provide: ThreadsService,
          useValue: fakeThreadsService,
        },
      ],
    }).compile();

    service = module.get<ThreadsService>(ThreadsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
