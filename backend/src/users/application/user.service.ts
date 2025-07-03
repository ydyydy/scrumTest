import { User } from '../domain';

export abstract class UserService {
  abstract createUser(
    email: string,
    password: string,
    username: string,
    isAdmin: boolean,
  ): Promise<string>;

  abstract getUserByEmail(email: string): Promise<User>;
}
