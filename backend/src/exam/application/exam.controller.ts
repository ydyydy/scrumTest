import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ExamService } from './exam.service';
import { CreateExamDto } from '../dto/create-exam.dto';
import { SaveAnswerDto } from '../dto/save-answer.dto';
import { ExamResultDto } from '../dto/exam-result.dto';
import { RankingDto } from '../dto/ranking.dto';
import { QueryPaginationDto } from '../../../common/utils/query-pagination.dto';
import { PaginatedResponseDto } from '../../../common/dto/paginated-response.dto';
import { ExamHistoryItemDto } from '../dto/exam-history.dto';
import { TOP_RANKING_LIMIT } from '../../../common/utils/Constants';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../../common/utils/enum';

@Controller('exams')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Post()
  async create(@Body() dto: CreateExamDto, @Res() res: Response) {
    try {
      const exam = await this.examService.createExam(dto);
      const locationUrl = `/exams/${exam.id}`;

      res.status(HttpStatus.CREATED).location(locationUrl).json({
        id: exam.id,
        content: exam.content,
      });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  @Get('/ranking')
  async getTopRanking(): Promise<RankingDto> {
    return this.examService.getTopRanking(TOP_RANKING_LIMIT);
  }

  @Get('history/:userId')
  async getUserExamHistory(
    @Param('userId') userId: string,
    @Query() query: QueryPaginationDto,
  ): Promise<PaginatedResponseDto<ExamHistoryItemDto>> {
    const { page, limit } = query;
    return this.examService.getUserExamHistory(userId, page, limit);
  }

  @Get(':id')
  async getExamById(@Param('id') id: string, @Res() res: Response) {
    try {
      const exam = await this.examService.getExamById(id);
      res.status(HttpStatus.OK).json({
        id: exam.id,
        content: exam.content,
        score: exam.score,
        duration: exam.duration,
      });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  @Post(':id/answer')
  async saveAnswer(
    @Param('id') id: string,
    @Body() dto: SaveAnswerDto,
    @Res() res: Response,
  ) {
    try {
      const exam = await this.examService.saveUserAnswer(
        id,
        dto.questionId,
        dto.userAnswerIds,
      );

      res.status(HttpStatus.OK).json({
        id: exam.id,
        content: exam.content,
      });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  @Post(':id/finish')
  async finishExam(@Param('id') id: string, @Res() res: Response) {
    try {
      const exam = await this.examService.finishExam(id);

      res.status(HttpStatus.OK).json({
        id: exam.id,
        content: exam.content,
        score: exam.score,
        duration: exam.duration,
        finishDate: exam.finishDate,
      });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  @Get(':id/result')
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

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async delete(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.examService.deleteExam(id);
      res.status(HttpStatus.NO_CONTENT).send();
    } catch (err) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  @Delete('user/multiple')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async deleteMany(@Body('ids') ids: string[], @Res() res: Response) {
    try {
      await this.examService.deleteManyExamsByManyUser(ids);
      res.status(HttpStatus.NO_CONTENT).send();
    } catch (err) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  @Delete('user/:userId')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async deleteAllExamsOfUser(
    @Param('userId') userId: string,
    @Res() res: Response,
  ) {
    try {
      await this.examService.deleteAllExamsOfUser(userId);
      res.status(HttpStatus.NO_CONTENT).send();
    } catch (err) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }
}
