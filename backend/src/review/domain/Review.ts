import { EntityRoot } from '../../../common/core/EntityRoot';
import { UniqueEntityID } from '../../../common/core/UniqueEntityID';

export interface ReviewQuestion {
  questionId: string;
  userAnswer?: string;
  isCorrect?: boolean;
}

export interface ReviewContent {
  questions: ReviewQuestion[];
}

export interface ReviewProps {
  userId: string;
  startDate: Date;
  updatedAt: Date;
  content: ReviewContent;
}

export class Review extends EntityRoot<ReviewProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get userId(): string {
    return this.props.userId;
  }

  set userId(userId: string) {
    this.props.userId = userId;
  }

  get startDate(): Date {
    return this.props.startDate;
  }

  set startDate(startDate: Date) {
    this.props.startDate = startDate;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }

  get content(): ReviewContent {
    return this.props.content;
  }

  set content(content: ReviewContent) {
    this.props.content = content;
  }

  public static create(props: ReviewProps, id?: UniqueEntityID): Review {
    if (
      !props.userId ||
      !props.startDate ||
      !props.updatedAt ||
      !props.content
    ) {
      throw new Error('[Review] Missing properties.');
    }

    return new Review(props, id);
  }
}
