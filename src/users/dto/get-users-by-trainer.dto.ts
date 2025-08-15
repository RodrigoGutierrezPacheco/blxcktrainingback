import { IsUUID } from 'class-validator';

export class GetUsersByTrainerDto {
  @IsUUID()
  trainerId: string;
}
