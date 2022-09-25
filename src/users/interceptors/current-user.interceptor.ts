import { Injectable, NestInterceptor, UseInterceptors } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common/interfaces/features/execution-context.interface';
import { Observable } from 'rxjs';
import { CallHandler } from '@nestjs/common/interfaces/features/nest-interceptor.interface';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any> | Promise<Observable<any>>> {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session || {};
    if (userId) {
      const user = await this.usersService.findOne(userId);
      request.currentUser = user;
    }
    return next.handle();
  }
}
