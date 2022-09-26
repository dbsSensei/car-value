import { Injectable, NestInterceptor } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common/interfaces/features/execution-context.interface';
import { CallHandler } from '@nestjs/common/interfaces/features/nest-interceptor.interface';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session || {};
    if (userId) {
      const user = await this.usersService.findOne(userId);
      request.currentUser = user;
    }
    return next.handle();
  }
}
