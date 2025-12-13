export interface AnswerQuestionDto {
  questionId: string;
  userAnswerIds: string[];
}

export interface AnswerQuestionResult {
  isCorrect: boolean;
  correctAnswerIds: string[];
  progress: {
    answered: number;
    total: number;
  };
}
