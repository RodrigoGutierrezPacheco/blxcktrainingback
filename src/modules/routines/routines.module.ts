import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutinesService } from './routines.service';
import { RoutinesController } from './routines.controller';
import { ProgressService } from './services/progress.service';
import { Routine } from './entities/routine.entity';
import { Week } from './entities/week.entity';
import { Day } from './entities/day.entity';
import { Exercise } from './entities/exercise.entity';
import { UserRoutine } from './entities/user-routine.entity';
import { UserExerciseProgress } from './entities/user-exercise-progress.entity';
import { UserDayProgress } from './entities/user-day-progress.entity';
import { UserWeekProgress } from './entities/user-week-progress.entity';
import { UserRoutineProgress } from './entities/user-routine-progress.entity';
import { UsersModule } from '../../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Routine, 
      Week, 
      Day, 
      Exercise, 
      UserRoutine,
      UserExerciseProgress,
      UserDayProgress,
      UserWeekProgress,
      UserRoutineProgress
    ]),
    UsersModule,
  ],
  controllers: [RoutinesController],
  providers: [RoutinesService, ProgressService],
  exports: [RoutinesService, ProgressService],
})
export class RoutinesModule {}
