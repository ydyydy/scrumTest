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
import { Review } from '../domain';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  /** Crear un review (modo repaso) */
  @Post()
  @Public()
  async create(@Body() dto: CreateReviewDto, @Res() res: Response) {
    console.log('Creating review for user:', dto);

    const review = await this.reviewService.create(dto);

    const locationUrl = `/reviews/${review.id}`;
    res
      .status(HttpStatus.CREATED)
      .location(locationUrl)
      .json({ id: review.id });
  }

  /** Obtener review por id */
  @Get(':id')
  @Public()
  async findById(@Param('id') id: string): Promise<Review> {
    return this.reviewService.findById(id);
  }

  /** Obtener el review del usuario */
  @Get('user/:userId')
  @Public()
  async findByUser(@Param('userId') userId: string): Promise<Review | null> {
    return this.reviewService.findByUser(userId);
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
}
