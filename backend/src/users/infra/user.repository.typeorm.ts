import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository as TypeOrmRepository } from 'typeorm/repository/Repository';
import { Not } from 'typeorm';
import { UserRepository } from '../user.repository';
import * as Persistence from './persistence';
import * as Domain from '../domain';
import { UserMapper } from '../mappers/user.mapper';
import { PaginationDefaults } from '../../../common/utils/enum';

@Injectable()
export class UserRepositoryTypeOrm extends UserRepository {
  constructor(
    @InjectRepository(Persistence.User)
    private readonly userRepository: TypeOrmRepository<Persistence.User>,
  ) {
    super();
  }

  async save(entity: Domain.User): Promise<Domain.User> {
    const user = await this.userRepository.save(
      UserMapper.toPersistence(entity),
    );
    return UserMapper.toDomain(user);
  }

  async findById(id: string): Promise<Domain.User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return UserMapper.toDomain(user);
  }

  async findByEmail(email: string): Promise<Domain.User> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return UserMapper.toDomain(user);
  }

  async findUsers(
    myUserId?: string,
    page: number = PaginationDefaults.DEFAULT_PAGE,
    limit: number = PaginationDefaults.DEFAULT_LIMIT,
  ): Promise<[Domain.User[], number]> {
    console.log('myUserId:', myUserId);
    // Obtener usuarios paginados
    const [users, total] = await this.userRepository.findAndCount({
      where: myUserId ? { id: Not(myUserId) } : undefined,
      skip: (page - 1) * limit,
      take: limit,
    });

    // Transformar cada usuario a dominio
    const usersDomain = users.map((u) => UserMapper.toDomain(u));

    return [usersDomain, total];
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
