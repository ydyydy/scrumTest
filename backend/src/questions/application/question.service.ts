import { Question } from '../domain';
import { CreateQuestionDto } from '../dto/create-question.dto';

export abstract class QuestionService {
  abstract create(dto: CreateQuestionDto, isAdmin: boolean): Promise<Question>;

  abstract delete(id: string, isAdmin: boolean): Promise<void>;

  abstract findAll(
    page?: number,
    limit?: number,
  ): Promise<[Question[], number]>;

  abstract findById(id: string): Promise<Question>;
}
