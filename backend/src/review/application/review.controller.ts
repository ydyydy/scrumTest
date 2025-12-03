import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { Public } from '../../auth/decorators/public.decorator';
import { ReviewService } from './review.service';
import { UpdateReviewDto } from '../dto/update-review.dto';
import { CreateReviewDto } from '../dto/create-review.dto';
import { SubmitReviewAnswerDto } from '../dto/submit-review-answer.dto';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @Public()
  async create(@Body() dto: CreateReviewDto, @Res() res: Response) {
    const review = await this.reviewService.create(dto);

    const locationUrl = `/reviews/${review.id}`;
    res
      .status(HttpStatus.CREATED)
      .location(locationUrl)
      .json({ id: review.id, content: review.content });
  }

  /** Obtener review por id */
  @Get(':id')
  @Public()
  async findById(@Param('id') id: string, @Res() res: Response) {
    const review = await this.reviewService.findById(id);

    if (!review) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: `Review con id ${id} no encontrado` });
    }

    const locationUrl = `/reviews/${review.id}`;
    return res
      .status(HttpStatus.OK)
      .location(locationUrl)
      .json({ id: review.id, content: review.content });
  }

  /** Obtener el review del usuario */
  @Get('user/:userId')
  @Public()
  async findByUser(@Param('userId') userId: string, @Res() res: Response) {
    const review = await this.reviewService.findByUser(userId);
    if (!review) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: `Review con id ${userId} no encontrado` });
    }

    const locationUrl = `/reviews/${review.id}`;
    return res
      .status(HttpStatus.OK)
      .location(locationUrl)
      .json({ id: review.id, content: review.content });
  }

  /** Actualizar el contenido del review */
  @Patch(':id')
  @Public()
  async updateReview(
    @Param('id') id: string,
    @Body() dto: UpdateReviewDto,
  ): Promise<void> {
    return this.reviewService.update(id, dto);
  }

  @Patch(':id/answer')
  @Public()
  async answerQuestion(
    @Param('id') reviewId: string,
    @Body() dto: SubmitReviewAnswerDto,
  ) {
    return this.reviewService.answerQuestion(reviewId, dto);
  }

  @Post(':id/reset')
  @Public()
  async reset(@Param('id') reviewId: string, @Res() res: Response) {
    try {
      const review = await this.reviewService.resetReview(reviewId);
      res.status(HttpStatus.OK).json(review);
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }
}
