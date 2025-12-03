import { User } from '../domain';
import { CreateUserDto } from '../dto/create-user.dto';

export abstract class UserService {
  abstract createUser(
    email: string,
    password: string,
    username: string,
    isAdmin: boolean,
  ): Promise<string>;

  abstract getUserByEmail(email: string): Promise<User>;

  abstract getUserById(id: string): Promise<User>;

  abstract updateUser(
    id: string,
    updateUserDto: Partial<CreateUserDto>,
  ): Promise<void>;
}
