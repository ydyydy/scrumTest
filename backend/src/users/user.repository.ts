import { Repository } from '../../common/core/repository';
import * as Domain from './domain';

export abstract class UserRepository extends Repository<Domain.User> {
  abstract findByEmail(email: string): Promise<Domain.User>;

  abstract findUsers(
    page?: number,
    limit?: number,
  ): Promise<[Domain.User[], number]>;

  abstract delete(id: string): Promise<void>;
}
