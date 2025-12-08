import { UniqueEntityID } from '../../../common/core/UniqueEntityID';
import * as Domain from '../domain';
import * as Persistence from '../infra/persistence';

export class ExamMapper {
  static toDomain(raw: Persistence.Exam): Domain.Exam {
    return Domain.Exam.create(
      {
        userId: raw.userId,
        startDate: raw.startDate,
        finishDate: raw.finishDate,
        duration: raw.duration,
        score: raw.score,
        content: raw.content,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPersistence(exam: Domain.Exam): Persistence.Exam {
    const entity = new Persistence.Exam();

    entity.id = exam.id.toString();
    entity.userId = exam.userId;
    entity.startDate = exam.startDate;
    entity.finishDate = exam.finishDate;
    entity.duration = exam.duration;
    entity.score = exam.score;

    entity.content = exam.content;

    return entity;
  }
}
