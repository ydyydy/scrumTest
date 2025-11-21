import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeOrmRepository } from 'typeorm/repository/Repository';
import { ReviewRepository } from '../review.repository';
import { Review } from '../domain';
import * as Persistence from './persistence';
import { ReviewMapper } from '../mappers/ReviewMapper';
import * as Domain from '../domain';

@Injectable()
export class ReviewRepositoryTypeOrm extends ReviewRepository {
  constructor(
    @InjectRepository(Persistence.Review)
    private readonly reviewRepository: TypeOrmRepository<Persistence.Review>,
  ) {
    super();
  }

  /** Crear un nuevo review */
  async save(entity: Domain.Review): Promise<Domain.Review> {
    const domainReview = Review.create({
      userId: entity.userId,
      startDate: new Date(),
      updatedAt: new Date(),
      content: entity.content,
    });

    const review = ReviewMapper.toPersistence(domainReview);
    await this.reviewRepository.save(review);

    return domainReview;
  }

  /** Buscar review por usuario */
  async findByUser(userId: string): Promise<Review | null> {
    const raw = await this.reviewRepository.findOne({
      where: { userId },
    });

    if (!raw) return null;

    return ReviewMapper.toDomain(raw);
  }

  /** Guardar cambios en el dominio (update manual) */
  async updateReview(review: Review): Promise<void> {
    const entity = ReviewMapper.toPersistence(review);
    await this.reviewRepository.save(entity);
  }

  /** Buscar por id */
  async findById(id: string): Promise<Review> {
    const raw = await this.reviewRepository.findOneBy({ id });

    if (!raw) {
      throw new Error(`Review with id ${id} not found`);
    }

    return ReviewMapper.toDomain(raw);
  }
}
