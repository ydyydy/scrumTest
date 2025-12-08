import { Injectable } from '@nestjs/common';
import { CreateExamDto } from '../dto/create-exam.dto';
import { Exam } from '../domain';
import { ExamResultDto } from '../dto/exam-result.dto';
import { RankingDto } from '../dto/ranking.dto';
import { PaginatedResponseDto } from '../../../common/dto/paginated-response.dto';
import { ExamHistoryItemDto } from '../dto/exam-history.dto';

@Injectable()
export abstract class ExamService {
  abstract createExam(dto: CreateExamDto): Promise<Exam>;

  abstract getExamById(id: string): Promise<Exam>;

  abstract deleteExam(id: string): Promise<void>;

  abstract saveUserAnswer(
    examId: string,
    questionId: string,
    userAnswerIds: string[],
  ): Promise<Exam>;

  abstract finishExam(examId: string): Promise<Exam>;

  abstract getExamResultById(examId: string): Promise<ExamResultDto>;

  abstract getTopRanking(limit?: number): Promise<RankingDto>;

  abstract getUserExamHistory(
    userId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResponseDto<ExamHistoryItemDto>>;
}
