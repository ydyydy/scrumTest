import { Injectable, NotFoundException } from '@nestjs/common';
import { ExamService } from './exam.service';
import { ExamRepository } from '../exam.repository';
import { QuestionRepository } from '../../questions/question.repository';
import { CreateExamDto } from '../dto/create-exam.dto';
import { UpdateAnswerDto } from '../dto/update-answer.dto';
import { Exam } from '../domain/Exam';

@Injectable()
export class ExamServiceImpl implements ExamService {
  constructor(
    private readonly examRepository: ExamRepository,
    private readonly questionRepository: QuestionRepository,
  ) {}

  async createExam(dto: CreateExamDto): Promise<Exam> {
    const startDate = new Date();
    const durationMinutes = 45;
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);

    // Obtener todas las preguntas
    const [questions] = await this.questionRepository.findQuestions(1, 999999);

    if (questions.length < 45) {
      throw new Error('No hay suficientes preguntas para generar un examen.');
    }

    // Barajar preguntas (Fisher–Yates)
    const shuffled = [...questions];
    // eslint-disable-next-line no-plusplus
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Elegir 45 aleatorias
    const selected = shuffled.slice(0, 45);

    // Construir contenido vacío del examen
    const content = {
      questions: selected.map((q) => ({
        questionId: q.id.toString(),
        correctAnswerId: undefined,
        userAnswer: undefined,
        isCorrect: undefined,
      })),
    };

    // Construir entidad del dominio
    const exam = new Exam({
      userId: dto.userId,
      startDate,
      endDate,
      score: 0,
      timeSpent: 0,
      content,
      isSubmitted: false,
    });

    // Guardar examen
    return this.examRepository.save(exam);
  }

  async answerQuestion(examId: string, dto: UpdateAnswerDto): Promise<void> {
    const exam = await this.examRepository.findById(examId);
    if (!exam) throw new NotFoundException('Exam not found');

    const q = exam.content.questions.find(
      (x) => x.questionId === dto.questionId,
    );
    if (!q) throw new Error('Question not found in exam');

    q.userAnswer = dto.userAnswer;

    this.examRepository.updateExam(exam);
  }

  async findById(id: string): Promise<Exam> {
    const exam = await this.examRepository.findById(id);
    if (!exam) throw new NotFoundException('Exam not found');
    return exam;
  }
}
