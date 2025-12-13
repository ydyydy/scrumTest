export interface AnswerDto {
  text: string;
  isCorrect?: boolean;
}

export interface CreateQuestionDto {
  text: string;
  answers: AnswerDto[];
  category: string;
  questionType: "single" | "multiple";
}
