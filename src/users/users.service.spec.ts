import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    fakeUsersService = {
      async find(email: string): Promise<User[]> {
        return Promise.resolve([
          {
            id: 1,
            email: email,
            password: 'password',
          } as User,
        ]);
      },
      async findOne(id: number): Promise<User> {
        return Promise.resolve({
          id,
          email: 'test@test.com',
          password: 'password',
        } as User);
      },
      // async remove(id: number): Promise<User> {},
      // async update(id: number, attrs: Partial<User>): Promise<User> {},
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
