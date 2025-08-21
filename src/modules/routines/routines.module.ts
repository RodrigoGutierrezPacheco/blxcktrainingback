import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutinesService } from './routines.service';
import { RoutinesController } from './routines.controller';
import { Routine } from './entities/routine.entity';
import { Week } from './entities/week.entity';
import { Day } from './entities/day.entity';
import { Exercise } from './entities/exercise.entity';
import { UserRoutine } from './entities/user-routine.entity';
import { UsersModule } from '../../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Routine, Week, Day, Exercise, UserRoutine]),
    UsersModule,
  ],
  controllers: [RoutinesController],
  providers: [RoutinesService],
  exports: [RoutinesService],
})
export class RoutinesModule {}
