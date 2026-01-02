import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  username: string;

  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

  @Column({
    type: 'int',
    default: 100,
  })
  points: number;
}
