import { Repository } from '../../common/core/repository';
import * as Domain from './domain';

export abstract class ReviewRepository extends Repository<Domain.Review> {
  abstract save(entity: Domain.Review): Promise<Domain.Review>;

  abstract findByUser(userId: string): Promise<Domain.Review | null>;

  abstract updateReview(review: Domain.Review): Promise<void>;
}
