import { UniqueEntityID } from '../../../common/core/UniqueEntityID';
import * as Domain from '../domain';
import * as Persistence from '../infra/persistence';

export class AnswerMapper {
  static toDomain(raw: Persistence.Answer): Domain.Answer {
    return Domain.Answer.create(
      {
        text: raw.text,
        isCorrect: raw.isCorrect,
        questionId: new UniqueEntityID(raw.questionId),
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPersistence(answer: Domain.Answer): Persistence.Answer {
    const entity = new Persistence.Answer();
    entity.id = answer.id.toString();
    entity.text = answer.text;
    entity.isCorrect = answer.isCorrect;
    entity.questionId = answer.questionId.toString();
    return entity;
  }
}
