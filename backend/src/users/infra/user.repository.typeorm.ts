import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository as TypeOrmRepository } from 'typeorm/repository/Repository';
import { UserRepository } from '../user.repository';
import * as Persistence from './persistence';
import * as Domain from '../domain';
import { UserMapper } from '../user.mapper';

@Injectable()
export class UserRepositoryTypeOrm extends UserRepository {
  constructor(
    @InjectRepository(Persistence.User)
    private readonly userRepository: TypeOrmRepository<Persistence.User>,
  ) {
    super();
  }

  save(entity: Domain.User): Promise<Domain.User> {
    return this.userRepository
      .save(UserMapper.toPersistence(entity))
      .then((user) => UserMapper.toDomain(user));
  }

  async findById(id: string): Promise<Domain.User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return UserMapper.toDomain(user);
  }

  async findByEmail(email: string): Promise<Domain.User> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }
    return UserMapper.toDomain(user);
  }
}
