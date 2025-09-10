import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExercisesService } from './exercises.service';
import { ExercisesController } from './exercises.controller';
import { Exercise } from './entities/exercise.entity';
import { MuscleGroup } from '../muscle-groups/entities/muscle-group.entity';
import { MediaAsset } from '../media-assets/entities/media-asset.entity';
import { FirebaseModule } from '../../common/firebase/firebase.module';
import { MediaAssetsModule } from '../media-assets/media-assets.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Exercise, MuscleGroup, MediaAsset]),
    FirebaseModule,
    MediaAssetsModule
  ],
  controllers: [ExercisesController],
  providers: [ExercisesService],
  exports: [ExercisesService],
})
export class ExercisesModule {}
