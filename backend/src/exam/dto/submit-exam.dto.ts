export class SubmitExamDto {
  userAnswers: Array<{
    questionId: string;
    userAnswer: string;
  }>;
}
