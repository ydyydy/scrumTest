import { ExamResultAnswerDto } from './exam-result-answer.dto';

export class ExamResultQuestionDto {
  questionId: string;

  text: string;

  answers: ExamResultAnswerDto[];

  userAnswerIds: string[];

  isCorrect: boolean;

  answered: boolean;
}
