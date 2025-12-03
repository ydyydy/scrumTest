import * as Domain from '../domain';
import * as Persistence from '../infra/persistence';
import { UniqueEntityID } from '../../../common/core/UniqueEntityID';
import { ExamContent } from '../domain/Exam';

export class ExamMapper {
  static toDomain(raw: Persistence.Exam): Domain.Exam {
    return Domain.Exam.create(
      {
        userId: raw.userId,
        startDate: raw.startDate,
        endDate: raw.endDate,
        timeSpent: raw.timeSpent,
        score: raw.score,
        content: raw.content as ExamContent,
        isSubmitted: raw.isSubmitted,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPersistence(exam: Domain.Exam): Persistence.Exam {
    const entity = new Persistence.Exam();
    entity.id = exam.id.toString();
    entity.userId = exam.userId;
    entity.startDate = exam.startDate;
    entity.endDate = exam.endDate;
    entity.timeSpent = exam.timeSpent;
    entity.score = exam.score;
    entity.isSubmitted = exam.isSubmitted;
    entity.content = exam.content;
    return entity;
  }
}
