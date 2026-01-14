import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';
import { ExamService } from './exam.service';
import { CreateExamDto } from '../dto/create-exam.dto';
import { ExamRepository } from '../exam.repository';
import { QuestionRepository } from '../../questions/question.repository';
import { Exam } from '../domain';
import { ExamContent, ExamQuestion } from '../domain/Exam';
import { ExamResultDto } from '../dto/exam-result.dto';
import { ExamResultQuestionDto } from '../dto/exam-result-question.dto';
import { ExamResultAnswerDto } from '../dto/exam-result-answer.dto';
import { RankingEntryDto } from '../dto/ranking-entry-dto';
import { RankingDto } from '../dto/ranking.dto';
import { UserRepository } from '../../users/user.repository';
import { PaginatedResponseDto } from '../../../common/dto/paginated-response.dto';
import { ExamHistoryItemDto } from '../dto/exam-history.dto';
import {
  EXAM_BONUS_POINTS,
  EXAM_COST_IN_POINTS,
} from '../../../common/utils/Constants';

@Injectable()
export class ExamServiceImpl implements ExamService {
  constructor(
    private readonly examRepository: ExamRepository,
    private readonly questionRepository: QuestionRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async createExam(dto: CreateExamDto): Promise<Exam> {
    // Traer usuario
    const user = await this.userRepository.findById(dto.userId);
    if (!user) throw new EntityNotFoundError('User not found', dto.userId);

    // Verificar si tiene suficientes puntos
    if (user.points < EXAM_COST_IN_POINTS)
      throw new Error('You do not have enough points to start an exam');

    // Traer todas las preguntas con sus respuestas
    const allQuestions =
      await this.questionRepository.findAllQuestionsWithAnswers();

    if (allQuestions.length < 55) {
      throw new Error(
        `No hay suficientes preguntas para iniciar el examen. Se requieren 55, pero hay ${allQuestions.length}.`,
      );
    }

    // Quitar 50 puntos
    user.points -= EXAM_COST_IN_POINTS;
    console.log(
      `Deducted ${EXAM_COST_IN_POINTS} points from user ${user.id}. New balance: ${user.points} points.`,
    );
    await this.userRepository.save(user);

    const questionsByCategory: Record<string, typeof allQuestions> = {};
    allQuestions.forEach((q) => {
      if (!questionsByCategory[q.category])
        questionsByCategory[q.category] = [];
      questionsByCategory[q.category].push(q);
    });

    const selectedQuestions: typeof allQuestions = [];

    // Tomar al menos 1 pregunta de cada categoría
    Object.keys(questionsByCategory).forEach((category) => {
      const questions = questionsByCategory[category];
      const randomIndex = Math.floor(Math.random() * questions.length);
      selectedQuestions.push(questions[randomIndex]);
    });

    // Completar el resto aleatoriamente hasta 55 preguntas
    const remainingQuestions = allQuestions.filter(
      (q) => !selectedQuestions.includes(q),
    );
    const remainingCount = 55 - selectedQuestions.length;

    const shuffledRemaining = remainingQuestions.sort(
      () => Math.random() - 0.5,
    );
    selectedQuestions.push(...shuffledRemaining.slice(0, remainingCount));

    // Generar el content del examen (incluyendo un snapshot de la pregunta)
    const content: ExamContent = {
      questions: selectedQuestions.map(
        (q): ExamQuestion => ({
          questionId: q.id.toString(),
          userAnswerIds: [],
          isCorrect: undefined,
          answered: false,
          snapshot: {
            text: q.text,
            answers: q.answers.map((a) => ({
              id: a.id.toString(),
              text: a.text,
              isCorrect: a.isCorrect,
            })),
          },
        }),
      ),
    };

    // Construir el dominio Exam

    const exam = Exam.create({
      userId: dto.userId,
      startDate: new Date(),
      finishDate: null,
      duration: null,
      score: null,
      content,
    });

    // Guardar en el repositorio
    return this.examRepository.save(exam);
  }

  async getExamById(id: string): Promise<Exam> {
    const exam = await this.examRepository.findById(id);
    if (!exam) throw new NotFoundException('Exam not found');
    return exam;
  }

  async saveUserAnswer(
    examId: string,
    questionId: string,
    userAnswerIds: string[],
  ): Promise<Exam> {
    const exam = await this.examRepository.findById(examId);
    if (!exam) throw new NotFoundException('Exam not found');

    const question = exam.content.questions.find(
      (q) => q.questionId === questionId,
    );
    if (!question) throw new NotFoundException('Question not found');

    question.userAnswerIds = userAnswerIds;
    question.answered = userAnswerIds.length > 0;

    return this.examRepository.update(exam);
  }

  async finishExam(examId: string): Promise<Exam> {
    const exam = await this.examRepository.findById(examId);
    if (!exam) throw new NotFoundException('Exam not found');

    const now = new Date();
    exam.finishDate = now;
    exam.duration = Math.floor(
      (now.getTime() - exam.startDate.getTime()) / 1000,
    );

    // Evaluar cada pregunta (usar snapshot si está disponible)
    const results = await Promise.all(
      exam.content.questions.map(async (q) => {
        let correctAnswerIds: string[] = [];

        if (q.snapshot && q.snapshot.answers) {
          correctAnswerIds = q.snapshot.answers
            .filter((a) => a.isCorrect)
            .map((a) => a.id);
        } else {
          const question = await this.questionRepository.findById(q.questionId);
          if (!question) {
            return { ...q, isCorrect: false, answered: false };
          }

          correctAnswerIds = question.answers
            .filter((a) => a.isCorrect)
            .map((a) => a.id.toString());
        }

        const userAnswers = q.userAnswerIds ?? [];

        const isCorrect =
          correctAnswerIds.length === userAnswers.length &&
          correctAnswerIds.every((id) => userAnswers.includes(id));

        return {
          ...q,
          isCorrect,
          answered: userAnswers.length > 0,
        };
      }),
    );

    exam.content.questions = results;

    // Calcular score sobre 100 puntos
    const correctCount = results.filter((q) => q.isCorrect).length;
    exam.score = Math.round((correctCount / 55) * 100);

    if (exam.score >= 90) {
      const user = await this.userRepository.findById(exam.userId);
      if (!user) throw new NotFoundException('User not found');
      console.log(`User ${user.id} now has ${user.points} points.`);

      user.points = (user.points ?? 0) + EXAM_BONUS_POINTS;
      console.log(`User ${user.id} now has ${user.points} points.`);

      await this.userRepository.save(user);
    }
    return this.examRepository.update(exam);
  }

  async getExamResultById(examId: string): Promise<ExamResultDto> {
    const exam = await this.examRepository.findById(examId);
    if (!exam) throw new NotFoundException('Exam not found');

    const questionsResult: ExamResultQuestionDto[] = await Promise.all(
      exam.content.questions.map(async (q) => {
        // Prefer snapshot, fallback to fetching the question; if missing, return a placeholder
        let text = 'Pregunta eliminada';
        let answers: ExamResultAnswerDto[] = [];

        if (q.snapshot) {
          text = q.snapshot.text;
          answers = q.snapshot.answers.map((a) => ({ id: a.id, text: a.text }));
        } else {
          try {
            const questionData = await this.questionRepository.findById(
              q.questionId,
            );
            if (questionData) {
              text = questionData.text;
              answers = questionData.answers.map((a) => ({
                id: a.id.toString(),
                text: a.text,
              }));
            }
          } catch {
            // If the question is truly missing, keep placeholder text
          }
        }

        return {
          questionId: q.questionId,
          text,
          answers,
          userAnswerIds: q.userAnswerIds ?? [],
          isCorrect: q.isCorrect ?? false,
          answered: q.answered ?? false,
        };
      }),
    );

    return {
      id: exam.id.toString(),
      score: exam.score,
      duration: exam.duration,
      questions: questionsResult,
    };
  }

  async getTopRanking(limit = 20): Promise<RankingDto> {
    const exams = await this.examRepository.findWithLimit(limit);
    const top: RankingEntryDto[] = await Promise.all(
      exams.map(async (exam) => {
        const user = await this.userRepository.findById(exam.userId);
        return {
          username: user?.username || 'Usuario desconocido',
          score: exam.score ?? 0,
          duration: exam.duration ?? 0,
        };
      }),
    );

    return { top };
  }

  async getUserExamHistory(
    userId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResponseDto<ExamHistoryItemDto>> {
    const [exams, total] = await this.examRepository.findHistoryByUser(
      userId,
      page,
      limit,
    );

    const items = exams.map((exam) => {
      const { id, score, duration, finishDate, content } = exam;
      const { questions = [] } = content ?? {};

      const correct = questions.filter(({ isCorrect }) => isCorrect).length;
      const incorrect = questions.filter(
        ({ answered, isCorrect }) => answered && !isCorrect,
      ).length;

      return {
        examId: id.toString(),
        score,
        duration,
        correct,
        incorrect,
        finishDate,
      };
    });

    return {
      items,
      total,
      page,
      limit,
    };
  }

  async deleteExam(id: string): Promise<void> {
    const exam = await this.examRepository.findById(id);
    if (!exam) throw new NotFoundException('Exam not found');
    await this.examRepository.delete(id);
  }

  async deleteAllExamsOfUser(userId: string): Promise<void> {
    await this.examRepository.deleteAllByUserId(userId);
  }

  async deleteManyExamsByManyUser(userIds: string[]): Promise<void> {
    await this.examRepository.deleteManyByUserIds(userIds);
  }
}
