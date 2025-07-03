import { ConflictException, Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from '../user.repository';
import { User } from '../domain';
import { UserPassword } from '../domain/Password';

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
    });

    const savedUser = await this.userRepository.save(user);
    return savedUser.id.toString();
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.userRepository.findByEmail(email);
  }
}
