import { UniqueEntityID } from '../../../common/core/UniqueEntityID';
import { EntityRoot } from '../../../common/core/EntityRoot';

export interface ExamQuestion {
  questionId: string;
  correctAnswerId?: string;
  userAnswer?: string;
  isCorrect?: boolean;
}

export interface ExamContent {
  questions: ExamQuestion[];
}

export interface ExamProps {
  userId: string;
  startDate: Date;
  endDate: Date;
  timeSpent: number;
  score: number;
  content: ExamContent;
  isSubmitted: boolean;
}

export class Exam extends EntityRoot<ExamProps> {
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

  get endDate(): Date {
    return this.props.endDate;
  }

  set endDate(endDate: Date) {
    this.props.endDate = endDate;
  }

  get timeSpent(): number {
    return this.props.timeSpent;
  }

  set timeSpent(timeSpent: number) {
    this.props.timeSpent = timeSpent;
  }

  get score(): number {
    return this.props.score;
  }

  set score(score: number) {
    this.props.score = score;
  }

  get content(): ExamContent {
    return this.props.content;
  }

  set content(content: ExamContent) {
    this.props.content = content;
  }

  set isSubmitted(isSubmitted: boolean) {
    this.props.isSubmitted = isSubmitted;
  }

  get isSubmitted(): boolean {
    return this.props.isSubmitted;
  }

  public static create(props: ExamProps, id?: UniqueEntityID): Exam {
    if (!props.userId) {
      throw new Error('[Exam] Missing userId property.');
    }

    return new Exam(props, id);
  }
}
