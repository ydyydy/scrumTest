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
import { Question } from '../domain';
import { QueryPaginationDto } from '../../../common/utils/query-pagination.dto';
import { QuestionResponseMapper } from '../mappers/question-response.mapper';
import { PaginatedResponseDto } from '../../../common/dto/paginated-response.dto';
import { ListQuestionDto } from '../dto/list-question.dto';
import { Public } from '../../auth/decorators/public.decorator';

@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async create(@Body() dto: CreateQuestionDto, @Res() res: Response) {
    const question = await this.questionService.create(dto);
    const locationUrl = `/questions/${question.id}`;
    res
      .status(HttpStatus.CREATED)
      .location(locationUrl)
      .json({ id: question.id });
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async delete(@Param('id') id: string): Promise<void> {
    return this.questionService.delete(id);
  }

  @Get()
  @Public()
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

  @Get(':id')
  @Public()
  async findById(@Param('id') id: string): Promise<Question> {
    return this.questionService.findById(id);
  }
}
