import { UniqueEntityID } from '../../../common/core/UniqueEntityID';
import { EntityRoot } from '../../../common/core/EntityRoot';
import { Answer } from './Answer';

export interface QuestionProps {
  text: string;
  answers: Answer[];
  category: string;
}

export class Question extends EntityRoot<QuestionProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get text(): string {
    return this.props.text;
  }

  set text(text: string) {
    this.props.text = text;
  }

  get answers(): Answer[] {
    return this.props.answers;
  }

  set answers(answers: Answer[]) {
    this.props.answers = answers;
  }

  get category(): string {
    return this.props.category;
  }

  set category(category: string) {
    this.props.category = category;
  }

  public static create(props: QuestionProps, id?: UniqueEntityID): Question {
    if (!props.text || !props.answers) {
      throw new Error('[Question] Missing properties.');
    }

    if (props.answers.length !== 4) {
      throw new Error('A question must have exactly 4 answers.');
    }

    // Cada respuesta debe pertenecer a esta pregunta
    if (id) {
      props.answers.forEach((a) => {
        if (a.questionId.toString() !== id.toString()) {
          throw new Error('Answer.questionId must match Question.id');
        }
      });
    }

    // Al menos una respuesta correcta
    const correctCount = props.answers.filter((a) => a.isCorrect).length;
    if (correctCount === 0) {
      throw new Error('A question must have at least one correct answer');
    }

    if (!props.category) {
      throw new Error('A question must have a category');
    }
    return new Question(props, id);
  }
}
