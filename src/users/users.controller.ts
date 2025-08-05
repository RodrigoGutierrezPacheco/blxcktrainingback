import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateNormalUserDto } from './dto/create-normal-user.dto';

@Controller('users/normal')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async registerNormalUser(@Body() createDto: CreateNormalUserDto) {
    return this.usersService.createNormalUser(createDto);
  }
}