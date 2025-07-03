import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './application/user.controller';
import { User } from './infra/persistence/user.entity';
import { UserRepositoryTypeOrm } from './infra/user.repository.typeorm';
import { UserRepository } from './user.repository';
import { UserService } from './application/user.service';
import { UserServiceImpl } from './application/user.service.impl';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    {
      provide: UserService,
      useClass: UserServiceImpl,
    },
    {
      provide: UserRepository,
      useClass: UserRepositoryTypeOrm,
    },
  ],
  exports: [UserService],
})
export class UsersModule {}
