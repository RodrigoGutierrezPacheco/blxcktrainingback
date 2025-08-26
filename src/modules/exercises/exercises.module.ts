import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExercisesService } from './exercises.service';
import { ExercisesController } from './exercises.controller';
import { Exercise } from './entities/exercise.entity';
import { MuscleGroup } from '../muscle-groups/entities/muscle-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exercise, MuscleGroup])],
  controllers: [ExercisesController],
  providers: [ExercisesService],
  exports: [ExercisesService],
})
export class ExercisesModule {}
