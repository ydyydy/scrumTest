import { UniqueEntityID } from '../../../common/core/UniqueEntityID';
import { AnswerMapper } from './answer.mapper';
import * as Domain from '../domain';
import * as Persistence from '../infra/persistence';

export class QuestionMapper {
  static toDomain(
    raw: Persistence.Question & { answers: Persistence.Answer[] },
  ): Domain.Question {
    const domainAnswers =
      raw.answers?.map((a) => AnswerMapper.toDomain(a)) ?? [];
    return Domain.Question.create(
      {
        text: raw.text,
        answers: domainAnswers,
        category: raw.category,
        questionType: raw.questionType,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPersistence(
    question: Domain.Question,
  ): Persistence.Question & { answers: Persistence.Answer[] } {
    const entity = new Persistence.Question();
    entity.id = question.id.toString();
    entity.text = question.text;
    entity.category = question.category;
    entity.questionType = question.questionType;

    const answersEntities = question.answers.map((a) =>
      AnswerMapper.toPersistence(a),
    );

    return {
      ...entity,
      answers: answersEntities,
    };
  }
}
