import { ExamContent } from '../domain/Exam';

export class CreateExamDto {
  userId: string;

  content: ExamContent;
}
