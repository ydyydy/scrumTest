import { EntityRoot } from '../../../common/core/EntityRoot';
import { UniqueEntityID } from '../../../common/core/UniqueEntityID';

export interface ExamQuestion {
  questionId: string;
  userAnswerIds?: string[];
  isCorrect?: boolean;
  answered?: boolean;
}

export interface ExamContent {
  questions: ExamQuestion[];
}

export interface ExamProps {
  userId: string;
  startDate: Date;
  finishDate: Date | null;
  duration: number | null;
  score: number | null;
  content: ExamContent;
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

  get finishDate(): Date | null {
    return this.props.finishDate;
  }

  set finishDate(finishDate: Date | null) {
    this.props.finishDate = finishDate;
  }

  get duration(): number | null {
    return this.props.duration;
  }

  set duration(duration: number | null) {
    this.props.duration = duration;
  }

  get score(): number | null {
    return this.props.score;
  }

  set score(score: number | null) {
    this.props.score = score;
  }

  get content(): ExamContent {
    return this.props.content;
  }

  set content(content: ExamContent) {
    this.props.content = content;
  }

  public static create(props: ExamProps, id?: UniqueEntityID): Exam {
    if (!props.userId || !props.startDate || !props.content) {
      throw new Error('[Exam] Missing required properties.');
    }

    return new Exam(props, id);
  }
}
