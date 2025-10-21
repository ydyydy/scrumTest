import { UniqueEntityID } from '../../../common/core/UniqueEntityID';
import { EntityRoot } from '../../../common/core/EntityRoot';

export interface AnswerProps {
  text: string;
  isCorrect: boolean;
  questionId: UniqueEntityID;
}

export class Answer extends EntityRoot<AnswerProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get text(): string {
    return this.props.text;
  }

  set text(text: string) {
    this.props.text = text;
  }

  get isCorrect(): boolean {
    return this.props.isCorrect;
  }

  set isCorrect(isCorrect: boolean) {
    this.props.isCorrect = isCorrect;
  }

  get questionId(): UniqueEntityID {
    return this.props.questionId;
  }

  set questionId(questionId: UniqueEntityID) {
    this.props.questionId = questionId;
  }

  public static create(props: AnswerProps, id?: UniqueEntityID): Answer {
    if (!props.text) {
      throw new Error('[Answer] Text is required');
    }
    if (props.isCorrect === undefined || props.isCorrect === null) {
      throw new Error('[Answer] isCorrect is required');
    }
    if (!props.questionId) {
      throw new Error('[Answer] questionId is required');
    }

    return new Answer(props, id);
  }
}
