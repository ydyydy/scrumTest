import { Injectable } from '@nestjs/common';
import { QuestionService } from './question.service';
import { Answer, Question } from '../domain';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { UniqueEntityID } from '../../../common/core/UniqueEntityID';
import { ReviewRepository } from '../../review/review.repository';
import { QuestionRepository } from '../question.repository';

@Injectable()
export class QuestionServiceImpl implements QuestionService {
  constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly reviewRepository: ReviewRepository,
  ) {}

  async create(dto: CreateQuestionDto): Promise<Question> {
    // Crear el ID de la pregunta
    const realQuestionId = new UniqueEntityID();

    // Crear objetos Answer del dominio con el questionId correcto
    const answers: Answer[] = dto.answers.map((a) =>
      Answer.create({
        text: a.text,
        isCorrect: a.isCorrect ?? false,
        questionId: realQuestionId,
      }),
    );

    // Crear Question del dominio con las 4 respuestas
    const question = Question.create(
      {
        text: dto.text,
        answers,
        category: dto.category,
        questionType: dto.questionType,
      },
      realQuestionId,
    );

    // Guardar en repositorio
    await this.questionRepository.save(question);

    // actualizar los reviews para que incluyan la nueva pregunta
    await this.reviewRepository.addQuestionToReviews(question.id.toString());

    return question;
  }

  async bulkCreate(dtos: CreateQuestionDto[]): Promise<Question[]> {
    const promises = dtos.map((dto) => this.create(dto));
    const createdQuestions = await Promise.all(promises);
    return createdQuestions;
  }

  async delete(id: string): Promise<void> {
    await this.questionRepository.delete(id);
  }

  async findAll(page?: number, limit?: number): Promise<[Question[], number]> {
    const [questions, total] = await this.questionRepository.findQuestions(
      page,
      limit,
    );
    return [questions, total];
  }

  async findById(id: string): Promise<Question> {
    return this.questionRepository.findById(id);
  }

  async countAllQuestions(): Promise<number> {
    return this.questionRepository.countAllQuestions();
  }
}
