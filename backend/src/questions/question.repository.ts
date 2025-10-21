import { Repository } from '../../common/core/repository';
import { Question } from './domain';

export abstract class QuestionRepository extends Repository<Question> {
  abstract save(entity: Question): Promise<Question>;

  abstract delete(id: string): Promise<void>;

  abstract findById(id: string): Promise<Question>;

  abstract findQuestions(page?: number, limit?: number): Promise<Question[]>;
}
