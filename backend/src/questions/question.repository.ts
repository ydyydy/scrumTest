import { Repository } from '../../common/core/repository';
import * as Domain from './domain';

export abstract class QuestionRepository extends Repository<Domain.Question> {
  abstract save(entity: Domain.Question): Promise<Domain.Question>;

  abstract delete(id: string): Promise<void>;

  abstract findById(id: string): Promise<Domain.Question>;

  abstract findQuestions(
    page?: number,
    limit?: number,
  ): Promise<[Domain.Question[], number]>;

  abstract findAllQuestionsWithAnswers(): Promise<Domain.Question[]>;
}
