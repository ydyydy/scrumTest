import { Repository } from '../../common/core/repository';
import * as Domain from './domain';

export abstract class ReviewRepository extends Repository<Domain.Review> {
  abstract save(entity: Domain.Review): Promise<Domain.Review>;

  abstract findByUser(userId: string): Promise<Domain.Review | null>;

  abstract updateReview(review: Domain.Review): Promise<void>;

  abstract addQuestionToReviews(questionId: string): Promise<void>;

  abstract delete(id: string): Promise<void>;

  abstract deleteByUserId(userId: string): Promise<void>;

  abstract deleteManyByUserId(ids: string[]): Promise<void>;
}
