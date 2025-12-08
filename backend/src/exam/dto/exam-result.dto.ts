import { ExamResultQuestionDto } from './exam-result-question.dto';

export class ExamResultDto {
  id: string;

  score: number | null;

  duration: number | null;

  questions: ExamResultQuestionDto[];
}
