import { Repository } from '../../common/core/repository';
import * as Domain from './domain';

export abstract class UserRepository extends Repository<Domain.User> {
  abstract findByEmail(email: string): Promise<Domain.User>;
}
