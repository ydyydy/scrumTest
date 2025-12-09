import { Repository } from '../../common/core/repository';
import * as Domain from './domain';

export abstract class ExamRepository extends Repository<Domain.Exam> {
  abstract save(exam: Domain.Exam): Promise<Domain.Exam>;

  abstract findById(id: string): Promise<Domain.Exam>;

  abstract findWithLimit(limit?: number): Promise<Domain.Exam[]>;

  abstract update(exam: Domain.Exam): Promise<Domain.Exam>;

  abstract findHistoryByUser(
    userId: string,
    page: number,
    limit: number,
  ): Promise<[Domain.Exam[], number]>;

  abstract delete(id: string): Promise<void>;

  abstract deleteAllByUserId(userId: string): Promise<void>;
}
