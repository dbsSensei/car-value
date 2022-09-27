import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  beforeEach(async () => {
    // Create a fake copy of the users service
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('asdf@asdf.com', 'asdf', false);
    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throw an error if user signup with email that is in use', async () => {
    try {
      await service.signup('test@test.com', 'password', false);
      await service.signup('test@test.com', 'password', false);
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  it('throw an error if user signin with invalid user', async () => {
    await service.signup('test@test.com', 'password', false);
    let user: User;
    try {
      user = await service.signin('test@test.com', 'aswesadasd');
    } catch (e) {
      expect(e).toBeDefined();
    }
    expect(user).toBeUndefined();
  });

  it('retruns a user if correct user provided', async () => {
    await service.signup('test@test.com', 'password', false);
    const loginUser = await service.signin('test@test.com', 'password');
    expect(loginUser).toBeDefined();
  });
});
