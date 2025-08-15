import { IsUUID } from 'class-validator';

export class AssignTrainerDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  trainerId: string;
}
