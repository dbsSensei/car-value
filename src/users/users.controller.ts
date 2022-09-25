import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/updare-user.dto';

@Controller('auth')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto) {
    await this.userService.create(body.email, body.password);
  }

  @Get('/:id')
  async findUser(@Param('id') id: number) {
    return await this.userService.findOne(+id);
  }

  @Get('/')
  async findAllUser(@Query('email') email: string) {
    return await this.userService.find(email);
  }

  @Patch('/:id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    await this.userService.update(+id, body);
  }

  @Delete('/:id')
  async removeUser(@Param('id') id: string) {
    await this.userService.remove(+id);
  }
}
