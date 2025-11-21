import { Question } from '../domain';
import { ListQuestionDto } from '../dto/list-question.dto';

export class QuestionResponseMapper {
  static toResponse(question: Question): ListQuestionDto {
    return {
      id: question.id.toString(),
      text: question.text,
      category: question.category.toString(),
      answers: question.answers.map((a) => ({
        id: a.id.toString(),
        text: a.text,
        isCorrect: a.isCorrect,
      })),
    };
  }

  static toPaginatedResponse(
    questions: Question[],
    total: number,
    page: number,
    limit: number,
  ) {
    return {
      items: questions.map(this.toResponse),
      total,
      page,
      limit,
    };
  }
}
