import { Response } from 'express';
import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { Public } from '../../auth/decorators/public.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const userId = await this.usersService.createUser(
      createUserDto.email,
      createUserDto.password,
      createUserDto.username,
      createUserDto.isAdmin,
    );

    const locationUrl = `/users/${userId}`;
    res.status(HttpStatus.CREATED).location(locationUrl).json({ id: userId });
  }
}
