import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

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
    fakeAuthService = {
      // async signup(email: string, password: string): Promise<User> {},
      async signin(email: string, password: string): Promise<User> {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUser('test@test.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('test@test.com');
  });

  it('findUser throw an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;
    try {
      const user = await controller.findUser(1);
      expect(user).toBeUndefined();
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  it('signin updates session object and returns user', async () => {
    const session = { userId: -10 };
    const user = await controller.signIn(
      {
        email: 'test@test.com',
        password: 'password',
      },
      session,
    );

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
