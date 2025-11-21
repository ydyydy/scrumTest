import { UniqueEntityID } from '../../../common/core/UniqueEntityID';
import * as Domain from '../domain';
import * as Persistence from '../infra/persistence';

export class ReviewMapper {
  static toDomain(raw: Persistence.Review): Domain.Review {
    return Domain.Review.create(
      {
        userId: raw.userId,
        startDate: raw.startDate,
        updatedAt: raw.updatedAt,
        content: raw.content,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPersistence(review: Domain.Review): Persistence.Review {
    const entity = new Persistence.Review();

    entity.id = review.id.toString();
    entity.userId = review.userId;
    entity.startDate = review.startDate;
    entity.updatedAt = review.updatedAt;

    // content JSON tal cual
    entity.content = review.content;

    return entity;
  }
}
