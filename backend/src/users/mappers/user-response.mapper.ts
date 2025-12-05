import { ListUserDto } from '../dto/list-user.dto';
import { User } from '../domain';

export class UserResponseMapper {
  static toDto(user: User): ListUserDto {
    return {
      id: user.id.toString(),
      username: user.username,
      email: user.email,
      role: user.isAdmin,
    };
  }

  static toPaginatedResponse(
    users: User[],
    total: number,
    page: number,
    limit: number,
  ) {
    return {
      items: users.map(this.toDto),
      total,
      page,
      limit,
    };
  }
}
