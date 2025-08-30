import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainerVerificationController } from './trainer-verification.controller';
import { TrainerVerificationService } from './trainer-verification.service';
import { TrainerVerificationDocument } from './entities/trainer-verification-document.entity';
import { Trainer } from 'src/users/entities/trainer.entity';
import { AuthModule } from 'src/auth/auth.module';
import { FirebaseModule } from 'src/common/firebase';
import { TrainerEducationModule } from './trainer-education.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TrainerVerificationDocument, Trainer]),
    AuthModule,
    FirebaseModule,
    TrainerEducationModule,
  ],
  controllers: [TrainerVerificationController],
  providers: [TrainerVerificationService],
  exports: [TrainerVerificationService, TrainerEducationModule],
})
export class TrainersModule {}
