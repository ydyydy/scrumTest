import { Injectable, NotFoundException } from '@nestjs/common';
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

@Injectable()
export class ExamServiceImpl implements ExamService {
  constructor(
    private readonly examRepository: ExamRepository,
    private readonly questionRepository: QuestionRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async createExam(dto: CreateExamDto): Promise<Exam> {
    // Traer todas las preguntas con sus respuestas
    const allQuestions =
      await this.questionRepository.findAllQuestionsWithAnswers();

    // Tomar solo 55 preguntas
    const selectedQuestions = allQuestions
      .sort(() => Math.random() - 0.5) // mezclar aleatoriamente
      .slice(0, 55);

    // Generar el content del examen
    const content: ExamContent = {
      questions: selectedQuestions.map(
        (q): ExamQuestion => ({
          questionId: q.id.toString(),
          userAnswerIds: [],
          isCorrect: undefined,
          answered: false,
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

    const duration =
      exam.finishDate == null
        ? Math.floor((now.getTime() - exam.startDate.getTime()) / 1000)
        : exam.duration;

    exam.finishDate = now;
    exam.duration = duration;

    // Calcular puntuación
    const correct = exam.content.questions.filter(
      (q) => q.isCorrect === true,
    ).length;
    exam.score = correct;

    return this.examRepository.update(exam);
  }

  async getExamResultById(examId: string): Promise<ExamResultDto> {
    const exam = await this.examRepository.findById(examId);
    if (!exam) throw new NotFoundException('Exam not found');

    const questionsResult: ExamResultQuestionDto[] = await Promise.all(
      exam.content.questions.map(async (q) => {
        const questionData = await this.questionRepository.findById(
          q.questionId,
        );
        if (!questionData)
          throw new NotFoundException(`Question ${q.questionId} not found`);

        const answers: ExamResultAnswerDto[] = questionData.answers.map(
          (a) => ({
            id: a.id.toString(),
            text: a.text,
          }),
        );

        return {
          questionId: q.questionId,
          text: questionData.text,
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
}
