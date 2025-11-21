import { Review } from '../domain';
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';

export abstract class ReviewService {
  abstract create(dto: CreateReviewDto): Promise<Review>;

  abstract findById(id: string): Promise<Review>;

  abstract findByUser(userId: string): Promise<Review | null>;

  abstract update(id: string, dto: UpdateReviewDto): Promise<void>;
}
