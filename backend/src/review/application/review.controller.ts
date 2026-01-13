import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  HttpStatus,
  Res,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ReviewService } from './review.service';
import { UpdateReviewDto } from '../dto/update-review.dto';
import { CreateReviewDto } from '../dto/create-review.dto';
import { SubmitReviewAnswerDto } from '../dto/submit-review-answer.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Role } from '../../../common/utils/enum';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  async create(@Body() dto: CreateReviewDto, @Res() res: Response) {
    try {
      const review = await this.reviewService.create(dto);

      const locationUrl = `/reviews/${review.id}`;
      res
        .status(HttpStatus.CREATED)
        .location(locationUrl)
        .json({ id: review.id, content: review.content });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Res() res: Response) {
    try {
      const review = await this.reviewService.findById(id);

      if (!review) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: `Review with id ${id} not found` });
      }

      const locationUrl = `/reviews/${review.id}`;
      return res
        .status(HttpStatus.OK)
        .location(locationUrl)
        .json({ id: review.id, content: review.content });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string, @Res() res: Response) {
    try {
      const review = await this.reviewService.findByUser(userId);
      if (!review) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: `Review with id ${userId} not found` });
      }

      const locationUrl = `/reviews/${review.id}`;
      return res
        .status(HttpStatus.OK)
        .location(locationUrl)
        .json({ id: review.id, content: review.content });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  @Patch(':id')
  async updateReview(
    @Param('id') id: string,
    @Body() dto: UpdateReviewDto,
    @Res() res: Response,
  ) {
    try {
      const review = await this.reviewService.update(id, dto);
      res.status(HttpStatus.OK).json(review);
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  @Patch(':id/answer')
  async answerQuestion(
    @Param('id') reviewId: string,
    @Body() dto: SubmitReviewAnswerDto,
    @Res() res: Response,
  ) {
    try {
      const review = await this.reviewService.answerQuestion(reviewId, dto);
      res.status(HttpStatus.OK).json(review);
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  @Post(':id/reset')
  async reset(@Param('id') reviewId: string, @Res() res: Response) {
    try {
      const review = await this.reviewService.resetReview(reviewId);
      res.status(HttpStatus.OK).json(review);
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  @Delete('user/multiple')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async deleteMany(@Body('ids') ids: string[], @Res() res: Response) {
    try {
      await this.reviewService.deleteManyByUserIds(ids);
      res
        .status(HttpStatus.OK)
        .json({ message: `Reviews with ids ${ids.join(', ')} deleted` });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async delete(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.reviewService.deleteReview(id);
      res
        .status(HttpStatus.OK)
        .json({ message: `Review with id ${id} deleted` });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  @Delete('user/:userId')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async deleteByUser(@Param('userId') userId: string, @Res() res: Response) {
    try {
      await this.reviewService.deleteReviewByUser(userId);
      res
        .status(HttpStatus.OK)
        .json({ message: `Reviews for user id ${userId} deleted` });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }
}
