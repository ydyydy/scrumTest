import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { QuestionService } from './question.service';
import { Role } from '../../../common/utils/enum';
import { QueryPaginationDto } from '../../../common/utils/query-pagination.dto';
import { QuestionResponseMapper } from '../mappers/question-response.mapper';
import { PaginatedResponseDto } from '../../../common/dto/paginated-response.dto';
import { ListQuestionDto } from '../dto/list-question.dto';

@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async create(@Body() dto: CreateQuestionDto, @Res() res: Response) {
    try {
      const question = await this.questionService.create(dto);
      const locationUrl = `/questions/${question.id}`;
      res
        .status(HttpStatus.CREATED)
        .location(locationUrl)
        .json({ id: question.id });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  @Post('import')
  async bulkCreateQuestions(
    @Body() dtos: CreateQuestionDto[],
    @Res() res: Response,
  ) {
    try {
      const questions = await this.questionService.bulkCreate(dtos);
      return res.status(HttpStatus.CREATED).json({
        total: questions.length,
        ids: questions.map((q) => q.id.toString()),
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async delete(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.questionService.delete(id);
      res
        .status(HttpStatus.OK)
        .json({ message: `Question with id ${id} deleted` });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  @Get()
  async findAll(
    @Query() query: QueryPaginationDto,
  ): Promise<PaginatedResponseDto<ListQuestionDto>> {
    const { page, limit } = query;
    const [questions, total] = await this.questionService.findAll(page, limit);

    return QuestionResponseMapper.toPaginatedResponse(
      questions,
      total,
      page,
      limit,
    );
  }

  @Get('count')
  async getQuestionsCount(@Res() res: Response) {
    try {
      const total = await this.questionService.countAllQuestions();
      return res.status(HttpStatus.OK).json({ total });
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error obteniendo total de preguntas',
        error: err.message,
      });
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Res() res: Response) {
    try {
      const question = await this.questionService.findById(id);
      if (!question) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: `Question with id ${id} not found` });
      }
      const locationUrl = `/questions/${question.id}`;
      return res.status(HttpStatus.OK).location(locationUrl).json(question);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }
}
