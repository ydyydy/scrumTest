export class ExamHistoryItemDto {
  examId: string;

  score: number | null;

  duration: number | null;

  correct: number;

  incorrect: number;

  finishDate: Date | null;
}
