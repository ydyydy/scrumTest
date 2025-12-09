import { Review } from '../domain';
import { AnswerQuestionDto } from '../dto/answer-question.dto';
import { CreateReviewDto } from '../dto/create-review.dto';
import { SubmitReviewAnswerDto } from '../dto/submit-review-answer.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';

export abstract class ReviewService {
  abstract create(dto: CreateReviewDto): Promise<Review>;

  abstract findById(id: string): Promise<Review>;

  abstract findByUser(userId: string): Promise<Review | null>;

  abstract update(id: string, dto: UpdateReviewDto): Promise<void>;

  abstract deleteReview(id: string): Promise<void>;

  abstract deleteReviewByUser(userId: string): Promise<void>;

  abstract answerQuestion(
    reviewId: string,
    dto: SubmitReviewAnswerDto,
  ): Promise<AnswerQuestionDto>;

  abstract resetReview(reviewId: string): Promise<void>;
}
