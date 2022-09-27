import { Injectable, NestMiddleware } from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}
  async use(req, res, next): Promise<any> {
    const { userId } = req.session || {};

    if (userId) {
      try {
        const user = await this.usersService.findOne(userId);
        req.currentUser = user;
      } catch (e) {
        console.log('user who belong this cookie has been deleted');
      }
    }

    next();
  }
}
