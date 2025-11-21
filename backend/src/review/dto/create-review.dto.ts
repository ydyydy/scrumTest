import { ReviewContent } from '../domain/Review';

export class CreateReviewDto {
  userId: string;

  content: ReviewContent;
}
