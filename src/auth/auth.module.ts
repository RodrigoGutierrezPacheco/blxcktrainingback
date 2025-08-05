// auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Trainer } from 'src/users/entities/trainer.entity';
import { Admin } from 'src/users/entities/admin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Trainer, Admin]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}