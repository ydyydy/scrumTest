import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository as TypeOrmRepository } from 'typeorm/repository/Repository';
import * as Persistence from './persistence';
import * as Domain from '../domain';
import { QuestionRepository } from '../question.repository';
import { QuestionMapper } from '../mappers/question.mapper';
import { AnswerMapper } from '../mappers/answer.mapper';
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

    try {
      await this.questionRepository.save({
        id: questionEntity.id,
        text: questionEntity.text,
        category: questionEntity.category,
        questionType: questionEntity.questionType,
      });
    } catch (err) {
      // Si falla la pregunta, no se guarda nada
      throw new Error(`Failed to save question: ${err.message}`);
    }

    // Solo guardar respuestas si la pregunta se guardó correctamente
    if (questionEntity.id) {
      const answersEntities = question.answers.map((a) =>
        AnswerMapper.toPersistence(a),
      );
      try {
        await this.answerRepository.save(answersEntities);
      } catch (err) {
        // Aquí podrías intentar borrar la pregunta para dejar consistencia, o simplemente lanzar error
        throw new Error(`Failed to save answers: ${err.message}`);
      }
    }

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
  ): Promise<[Domain.Question[], number]> {
    // Obtener preguntas paginadas
    const [questions, total] = await this.questionRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    // Para cada pregunta, traer sus respuestas
    const questionsWithAnswers = await Promise.all(
      questions.map(async (q) => {
        const answers = await this.answerRepository.findBy({
          questionId: q.id,
        });
        return QuestionMapper.toDomain({ ...q, answers });
      }),
    );
    return [questionsWithAnswers, total];
  }

  async findAllQuestionsWithAnswers(): Promise<Domain.Question[]> {
    // 1. Traer todas las preguntas
    const questions = await this.questionRepository.find({
      order: { createdAt: 'DESC' },
    });

    // 2. Para cada pregunta, traer sus respuestas
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

  async countAllQuestions(): Promise<number> {
    const count = await this.questionRepository.count();
    return count;
  }
}
