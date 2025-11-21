import { ListAnswerDto } from './list-answer.dto';

export class ListQuestionDto {
  id: string;

  text: string;

  category: string;

  answers: ListAnswerDto[];
}
