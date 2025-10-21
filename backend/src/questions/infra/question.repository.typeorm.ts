import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository as TypeOrmRepository } from 'typeorm/repository/Repository';
import * as Persistence from './persistence';
import * as Domain from '../domain';
import { QuestionRepository } from '../question.repository';
import { QuestionMapper } from '../question.mapper';
import { AnswerMapper } from '../answer.mapper';
import { PaginationDefaults } from '../../../common/utils/enum';

@Injectable()
export class QuestionRepositoryTypeOrm extends QuestionRepository {
  constructor(
    @InjectRepository(Persistence.Question)
    private readonly questionRepository: TypeOrmRepository<Persistence.Question>,

    @InjectRepository(Persistence.Answer)
    private readonly answerRepository: TypeOrmRepository<Persistence.Answer>,
  ) {
    super();
  }

  async save(question: Domain.Question): Promise<Domain.Question> {
    // Guardar la pregunta
    const questionEntity = QuestionMapper.toPersistence(question);
    await this.questionRepository.save({
      id: questionEntity.id,
      text: questionEntity.text,
    });

    // Guardar todas las respuestas asociadas
    const answersEntities = question.answers.map((a) =>
      AnswerMapper.toPersistence(a),
    );

    await this.answerRepository.save(answersEntities);

    return question;
  }

  async delete(id: string): Promise<void> {
    await this.answerRepository.delete({ questionId: id });
    await this.questionRepository.delete({ id });
  }

  async findById(id: string): Promise<Domain.Question> {
    const questionEntity = await this.questionRepository.findOneBy({ id });
    if (!questionEntity) {
      throw new Error(`Question with id ${id} not found`);
    }

    const answersEntities = await this.answerRepository.findBy({
      questionId: id,
    });
    return QuestionMapper.toDomain({
      ...questionEntity,
      answers: answersEntities,
    });
  }

  async findQuestions(
    page: number = PaginationDefaults.DEFAULT_PAGE,
    limit: number = PaginationDefaults.DEFAULT_LIMIT,
  ): Promise<Domain.Question[]> {
    // Traer preguntas con paginación
    const questions = await this.questionRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    // Traer respuestas de cada pregunta
    const questionsWithAnswers = await Promise.all(
      questions.map(async (q) => {
        const answers = await this.answerRepository.findBy({
          questionId: q.id,
        });
        return QuestionMapper.toDomain({ ...q, answers });
      }),
    );

    return questionsWithAnswers;
  }
}
