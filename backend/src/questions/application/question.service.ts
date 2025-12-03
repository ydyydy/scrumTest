import { Question } from '../domain';
import { CreateQuestionDto } from '../dto/create-question.dto';

export abstract class QuestionService {
  abstract create(dto: CreateQuestionDto): Promise<Question>;

  abstract delete(id: string): Promise<void>;

  abstract findAll(
    page?: number,
    limit?: number,
  ): Promise<[Question[], number]>;

  abstract findById(id: string): Promise<Question>;
}
