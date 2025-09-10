import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RoutinesModule } from './modules/routines/routines.module';
import { PlansModule } from './modules/plans/plans.module';
import { MuscleGroupsModule } from './modules/muscle-groups/muscle-groups.module';
import { ExercisesModule } from './modules/exercises/exercises.module';
import { TrainersModule } from './modules/trainers/trainers.module';
import { FirebaseModule } from './common/firebase';
import { MediaAssetsModule } from './modules/media-assets/media-assets.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    FirebaseModule,
    AuthModule,
    UsersModule,
    RoutinesModule,
    PlansModule,
    MuscleGroupsModule,
    ExercisesModule,
    TrainersModule,
    MediaAssetsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}