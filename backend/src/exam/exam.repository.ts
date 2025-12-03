import { Repository } from '../../common/core/repository';
import * as Domain from './domain';

export abstract class ExamRepository extends Repository<Domain.Exam> {
  abstract findById(id: string): Promise<Domain.Exam>;

  abstract updateExam(exam: Domain.Exam): Promise<void>;

  abstract save(exam: Domain.Exam): Promise<Domain.Exam>;
}
