import { UniqueEntityID } from '../../../common/core/UniqueEntityID';
import * as Domain from '../domain';
import { UserPassword } from '../domain/Password';
import * as Persistence from '../infra/persistence';

export class UserMapper {
  static toDomain(raw: Persistence.User): Domain.User {
    const user = Domain.User.create(
      {
        email: raw.email,
        username: raw.username,
        password: UserPassword.fromHashedPassword(raw.password),
        isAdmin: raw.isAdmin,
      },
      new UniqueEntityID(raw.id),
    );
    return user;
  }

  static toPersistence(user: Domain.User): Persistence.User {
    return {
      id: user.id.toString(),
      email: user.email,
      username: user.username,
      password: user.password,
      isAdmin: user.isAdmin,
    };
  }
}
