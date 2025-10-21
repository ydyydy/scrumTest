import { Injectable, UnauthorizedException } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionRepository } from '../question.repository';
import { Answer, Question } from '../domain';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { UniqueEntityID } from '../../../common/core/UniqueEntityID';

@Injectable()
export class QuestionServiceImpl implements QuestionService {
  constructor(private readonly questionRepository: QuestionRepository) {}

  private checkAdmin(isAdmin: boolean) {
    if (!isAdmin) {
      throw new UnauthorizedException('Only admins can perform this action');
    }
  }

  async create(dto: CreateQuestionDto, isAdmin: boolean): Promise<Question> {
    this.checkAdmin(isAdmin);

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
      },
      realQuestionId,
    );

    // 4️⃣ Guardar en repositorio
    await this.questionRepository.save(question);

    return question;
  }

  async delete(id: string, isAdmin: boolean): Promise<void> {
    this.checkAdmin(isAdmin);
    await this.questionRepository.delete(id);
  }

  async findAll(page?: number, limit?: number): Promise<Question[]> {
    const questions = await this.questionRepository.findQuestions(page, limit);
    return questions;
  }

  async findById(id: string): Promise<Question> {
    return this.questionRepository.findById(id);
  }
}
