import { Injectable } from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';
import { ReviewService } from './review.service';
import { ReviewRepository } from '../review.repository';
import { UserRepository } from '../../users/user.repository';
import { Review } from '../domain';
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';
import { QuestionRepository } from '../../questions/question.repository';
import { ReviewContent } from '../domain/Review';
import { SubmitReviewAnswerDto } from '../dto/submit-review-answer.dto';
import { AnswerQuestionDto } from '../dto/answer-question.dto';

@Injectable()
export class ReviewServiceImpl implements ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly questionRepository: QuestionRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create(dto: CreateReviewDto): Promise<Review> {
    // Comprobar si existe ya un review para el usuario
    const existingReview = await this.reviewRepository.findByUser(dto.userId);
    if (existingReview) {
      return existingReview;
    }

    // Traer todas las preguntas sin paginar
    const allQuestions =
      await this.questionRepository.findAllQuestionsWithAnswers();

    // Generar el content automáticamente
    const content: ReviewContent = {
      questions: allQuestions.map((q) => ({
        questionId: q.id.toString(),
        userAnswerIds: [],
        isCorrect: undefined,
        answered: false,
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

  async answerQuestion(
    reviewId: string,
    dto: SubmitReviewAnswerDto,
  ): Promise<AnswerQuestionDto> {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) throw new Error('Review not found');

    const questionEntry = review.content.questions.find(
      (q) => q.questionId === dto.questionId,
    );
    if (!questionEntry) throw new Error('Question not found in this review');

    // Bloquear si la pregunta ya fue respondida
    if (questionEntry.answered) {
      throw new Error('Question has already been answered');
    }
    // Obtener la pregunta real desde la tabla Question
    const realQuestion = await this.questionRepository.findById(dto.questionId);
    if (!realQuestion) throw new Error('Question entity not found');

    const correctAnswers = realQuestion.answers
      .filter((a) => a.isCorrect)
      .map((a) => a.id.toString());

    // Asegurarse de que userAnswerIds sea un array
    const userAnswers = dto.userAnswerIds ?? [];

    // Guardar respuestas del usuario
    questionEntry.userAnswerIds = userAnswers;
    questionEntry.answered = true;

    // Validación según tipo
    if (realQuestion.questionType === 'single') {
      // single: debe coincidir la única respuesta correcta
      questionEntry.isCorrect =
        userAnswers.length === 1 && correctAnswers.includes(userAnswers[0]);
    } else {
      // multiple: todas las correctas deben coincidir exactamente
      questionEntry.isCorrect =
        userAnswers.length === correctAnswers.length &&
        userAnswers.every((id) => correctAnswers.includes(id));
    }

    if (questionEntry.isCorrect) {
      const user = await this.userRepository.findById(review.userId);
      if (!user) throw new EntityNotFoundError('User not found', review.userId);

      user.points += 2;
      await this.userRepository.save(user);
    }

    // Actualizar timestamp
    review.updatedAt = new Date();
    await this.reviewRepository.updateReview(review);

    // Calcular progreso
    const answeredCount = review.content.questions.filter(
      (q) => q.answered,
    ).length;
    const totalQuestions = review.content.questions.length;

    // Retornar DTO tipado
    const result: AnswerQuestionDto = {
      isCorrect: questionEntry.isCorrect,
      correctAnswerIds: correctAnswers,
      progress: {
        answered: answeredCount,
        total: totalQuestions,
      },
    };

    return result;
  }

  async resetReview(reviewId: string): Promise<void> {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) throw new Error('Review not found');

    // Reiniciar todas las preguntas
    review.content.questions = review.content.questions.map((q) => ({
      ...q,
      answered: false,
      userAnswerIds: [],
      isCorrect: undefined,
    }));

    // Actualizar timestamp
    review.updatedAt = new Date();

    await this.reviewRepository.updateReview(review);
  }

  async deleteReview(id: string): Promise<void> {
    return this.reviewRepository.delete(id);
  }

  async deleteReviewByUser(userId: string): Promise<void> {
    return this.reviewRepository.deleteByUserId(userId);
  }
}
