export class AnswerQuestionDto {
  isCorrect: boolean;

  correctAnswerIds: string[];

  progress: {
    answered: number;
    total: number;
  };
}
