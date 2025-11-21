import { Injectable } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewRepository } from '../review.repository';
import { Review } from '../domain';
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';
import { QuestionRepository } from '../../questions/question.repository';
import { ReviewContent } from '../domain/Review';

@Injectable()
export class ReviewServiceImpl implements ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly questionRepository: QuestionRepository,
  ) {}

  async create(dto: CreateReviewDto): Promise<Review> {
    console.log('Creating review for user:', dto);
    // Traer todas las preguntas sin paginar
    const allQuestions =
      await this.questionRepository.findAllQuestionsWithAnswers();

    console.log('Fetched questions:', allQuestions);
    // Generar el content automáticamente
    const content: ReviewContent = {
      questions: allQuestions.map((q) => ({
        questionId: q.id.toString(),
        userAnswer: undefined,
        isCorrect: undefined,
      })),
    };

    // Mezclar aleatoriamente
    content.questions = content.questions.sort(() => Math.random() - 0.5);

    // Construir el dominio Review
    const review = new Review({
      userId: dto.userId,
      startDate: new Date(),
      updatedAt: new Date(),
      content,
    });

    // Guardar en el repositorio
    return this.reviewRepository.save(review);
  }

  /** Buscar review por id */
  async findById(id: string): Promise<Review> {
    return this.reviewRepository.findById(id);
  }

  /** Buscar review por usuario */
  async findByUser(userId: string): Promise<Review | null> {
    return this.reviewRepository.findByUser(userId);
  }

  /** Actualizar contenido de un review */
  async update(id: string, dto: UpdateReviewDto): Promise<void> {
    const review = await this.reviewRepository.findById(id);

    // Actualizar contenido directamente
    review.content = dto.content;
    review.updatedAt = new Date();

    await this.reviewRepository.save(review);
  }
}
