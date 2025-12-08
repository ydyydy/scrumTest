import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ExamService } from './exam.service';
import { CreateExamDto } from '../dto/create-exam.dto';
import { Public } from '../../auth/decorators/public.decorator';
import { SaveAnswerDto } from '../dto/save-answer.dto';
import { ExamResultDto } from '../dto/exam-result.dto';
import { RankingDto } from '../dto/ranking.dto';
import { QueryPaginationDto } from '../../../common/utils/query-pagination.dto';
import { PaginatedResponseDto } from '../../../common/dto/paginated-response.dto';
import { ExamHistoryItemDto } from '../dto/exam-history.dto';

@Controller('exams')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Post()
  @Public()
  async create(@Body() dto: CreateExamDto, @Res() res: Response) {
    const exam = await this.examService.createExam(dto);
    const locationUrl = `/exams/${exam.id}`;

    res.status(HttpStatus.CREATED).location(locationUrl).json({
      id: exam.id,
      content: exam.content,
    });
  }

  @Get('/ranking')
  @Public()
  async getTopRanking(): Promise<RankingDto> {
    return this.examService.getTopRanking(20);
  }

  @Get('history/:userId')
  @Public()
  async getUserExamHistory(
    @Param('userId') userId: string,
    @Query() query: QueryPaginationDto,
  ): Promise<PaginatedResponseDto<ExamHistoryItemDto>> {
    const { page, limit } = query;
    return this.examService.getUserExamHistory(userId, page, limit);
  }

  @Get(':id')
  @Public()
  async getExamById(@Param('id') id: string, @Res() res: Response) {
    const exam = await this.examService.getExamById(id);
    res.status(HttpStatus.OK).json({
      id: exam.id,
      content: exam.content,
      score: exam.score,
      duration: exam.duration,
    });
  }

  @Post(':id/answer')
  @Public()
  async saveAnswer(
    @Param('id') id: string,
    @Body() dto: SaveAnswerDto,
    @Res() res: Response,
  ) {
    const exam = await this.examService.saveUserAnswer(
      id,
      dto.questionId,
      dto.userAnswerIds,
    );

    res.status(HttpStatus.OK).json({
      id: exam.id,
      content: exam.content,
    });
  }

  @Post(':id/finish')
  @Public()
  async finishExam(@Param('id') id: string, @Res() res: Response) {
    const exam = await this.examService.finishExam(id);

    res.status(HttpStatus.OK).json({
      id: exam.id,
      content: exam.content,
      score: exam.score,
      duration: exam.duration,
      finishDate: exam.finishDate,
    });
  }

  @Get(':id/result')
  @Public()
  async getExamResult(@Param('id') id: string, @Res() res: Response) {
    try {
      const result: ExamResultDto =
        await this.examService.getExamResultById(id);
      res.status(HttpStatus.OK).json(result);
    } catch (err) {
      if (err.status && err.message) {
        res.status(err.status).json({ message: err.message });
      } else {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Internal server error' });
      }
    }
  }
}
