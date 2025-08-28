import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { NormalUser } from './entities/normal-user.entity';
import { UserBase } from './entities/user-base.entity';
import { User } from './entities/user.entity';
import { Trainer } from './entities/trainer.entity';
import { UserTrainer } from './entities/user-trainer.entity';
import { Admin } from './entities/admin.entity';
import { TrainerVerificationDocument } from '../modules/trainers/entities/trainer-verification-document.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserBase, NormalUser, User, Trainer, UserTrainer, Admin, TrainerVerificationDocument]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}