import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainerEducationController } from './trainer-education.controller';
import { TrainerEducationService } from './trainer-education.service';
import { TrainerEducationDocument } from './entities/trainer-education-document.entity';
import { Trainer } from 'src/users/entities/trainer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TrainerEducationDocument, Trainer]),
  ],
  controllers: [TrainerEducationController],
  providers: [TrainerEducationService],
  exports: [TrainerEducationService],
})
export class TrainerEducationModule {}
