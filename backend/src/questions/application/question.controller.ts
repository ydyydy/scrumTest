import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { QuestionServiceImpl } from './question.service.impl';
import { Role } from '../../../common/utils/enum';
import { Question } from '../domain';

@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionServiceImpl) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async create(@Body() dto: CreateQuestionDto): Promise<Question> {
    return this.questionService.create(dto, true);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async delete(@Param('id') id: string): Promise<void> {
    return this.questionService.delete(id, true);
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<Question[]> {
    return this.questionService.findAll(page, limit);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Question> {
    return this.questionService.findById(id);
  }
}
