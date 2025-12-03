import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity('reviews')
export class Review {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @CreateDateColumn()
  startDate: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'simple-json' })
  content: {
    questions: Array<{
      questionId: string;
      userAnswerIds?: string[];
      isCorrect?: boolean;
      answered?: boolean;
    }>;
  };
}
