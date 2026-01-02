import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from '../user.repository';
import { User } from '../domain';
import { UserPassword } from '../domain/Password';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UserServiceImpl implements UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(
    email: string,
    password: string,
    username: string,
    isAdmin: boolean,
  ): Promise<string> {
    try {
      await this.userRepository.findByEmail(email);
      throw new ConflictException('User with this email already exists');
    } catch (error) {
      if (error.message !== `User with email ${email} not found`) {
        throw error;
      }
    }
    const user = User.create({
      email,
      password: await UserPassword.create(password),
      username,
      isAdmin,
      points: 100,
    });

    const savedUser = await this.userRepository.save(user);
    return savedUser.id.toString();
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.userRepository.findByEmail(email);
  }

  async getUserById(id: string): Promise<User> {
    return this.userRepository.findById(id);
  }

  async updateUser(
    id: string,
    updateUserDto: Partial<CreateUserDto>,
  ): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.username = updateUserDto.username ?? user.username;
    user.isAdmin = updateUserDto.isAdmin ?? user.isAdmin;
    await this.userRepository.save(user);
  }

  async findAll(
    userId: string,
    page?: number,
    limit?: number,
  ): Promise<[User[], number]> {
    const [users, total] = await this.userRepository.findUsers(
      userId,
      page,
      limit,
    );
    return [users, total];
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.delete(id);
  }
}
