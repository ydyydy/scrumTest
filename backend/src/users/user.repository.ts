import { Repository } from '../../common/core/repository';
import * as Domain from './domain';

export abstract class UserRepository extends Repository<Domain.User> {
  abstract delete(id: string): Promise<void>;

  abstract findByEmail(email: string): Promise<Domain.User>;

  abstract findUsers(
    myUserId?: string,
    page?: number,
    limit?: number,
  ): Promise<[Domain.User[], number]>;

  abstract findById(id: string): Promise<Domain.User>;
}
