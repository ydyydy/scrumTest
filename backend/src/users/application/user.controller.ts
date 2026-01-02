import { Response } from 'express';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { Public } from '../../auth/decorators/public.decorator';
import { QueryPaginationDto } from '../../../common/utils/query-pagination.dto';
import { PaginatedResponseDto } from '../../../common/dto/paginated-response.dto';
import { ListUserDto } from '../dto/list-user.dto';
import { UserResponseMapper } from '../mappers/user-response.mapper';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../../common/utils/enum';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const userId = await this.usersService.createUser(
        createUserDto.email,
        createUserDto.password,
        createUserDto.username,
        createUserDto.isAdmin ?? false,
      );

      const locationUrl = `/users/${userId}`;
      res.status(HttpStatus.CREATED).location(locationUrl).json({ id: userId });
    } catch (error) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message || 'Error creating user' });
    }
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async delete(@Param('id') id: string): Promise<void> {
    return this.usersService.deleteUser(id);
  }

  @Get(':id')
  async getProfile(@Param('id') id: string, @Res() res: Response) {
    const user = await this.usersService.getUserById(id);
    if (!user) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'User not found' });
    }
    return res.json({
      id: user.id.toString(),
      email: user.email,
      username: user.username,
      points: user.points,
    });
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<CreateUserDto>,
    @Res() res: Response,
  ) {
    try {
      await this.usersService.updateUser(id, updateUserDto);
      return res
        .status(HttpStatus.OK)
        .json({ message: 'User updated successfully' });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @Get()
  async findAll(
    @Query() query: QueryPaginationDto,
    @Req() req,
  ): Promise<PaginatedResponseDto<ListUserDto>> {
    const { page, limit } = query;
    const userId = req.user?.sub?.value;
    const [users, total] = await this.usersService.findAll(userId, page, limit);

    return UserResponseMapper.toPaginatedResponse(users, total, page, limit);
  }
}
