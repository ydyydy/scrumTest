import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeOrmRepository } from 'typeorm/repository/Repository';
import { ReviewRepository } from '../review.repository';
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

  async save(entity: Domain.Review): Promise<Domain.Review> {
    const domainReview = Domain.Review.create({
      userId: entity.userId,
      startDate: new Date(),
      updatedAt: new Date(),
      content: entity.content,
    });

    const review = ReviewMapper.toPersistence(domainReview);
    await this.reviewRepository.save(review);

    return domainReview;
  }

  async findByUser(userId: string): Promise<Domain.Review | null> {
    const raw = await this.reviewRepository.findOneBy({ userId });

    if (!raw) {
      return null;
    }

    return ReviewMapper.toDomain(raw);
  }

  async updateReview(review: Domain.Review): Promise<void> {
    const entity = ReviewMapper.toPersistence(review);
    await this.reviewRepository.save(entity);
  }

  /** Buscar por id */
  async findById(id: string): Promise<Domain.Review> {
    const raw = await this.reviewRepository.findOneBy({ id });

    if (!raw) {
      throw new Error(`Review with id ${id} not found`);
    }

    return ReviewMapper.toDomain(raw);
  }

  async addQuestionToReviews(questionId: string): Promise<void> {
    // Obtener todos los reviews existentes (persistencia)
    const reviewsPersistence = await this.reviewRepository.find();

    await Promise.all(
      reviewsPersistence.map(async (reviewPersistence) => {
        // Convertir a dominio
        const reviewDomain = ReviewMapper.toDomain(reviewPersistence);

        // Evitar duplicados
        const alreadyExists = reviewDomain.content.questions.some(
          (q) => q.questionId === questionId,
        );
        if (alreadyExists) return;

        // Añadir nueva pregunta
        reviewDomain.content.questions.push({
          questionId,
          userAnswerIds: [],
          isCorrect: undefined,
          answered: false,
        });

        // Guardar cambios en el dominio
        await this.updateReview(reviewDomain);
      }),
    );
  }

  async delete(id: string): Promise<void> {
    await this.reviewRepository.delete(id);
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.reviewRepository.delete({ userId });
  }

  async deleteManyByUserId(userIds: string[]): Promise<void> {
    await this.reviewRepository
      .createQueryBuilder()
      .delete()
      .where('userId IN (:...userIds)', { userIds })
      .execute();
  }
}
