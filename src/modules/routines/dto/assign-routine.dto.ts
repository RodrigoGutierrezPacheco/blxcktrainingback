import { IsUUID, IsDateString, IsOptional, IsString } from 'class-validator';

export class AssignRoutineDto {
  @IsUUID()
  user_id: string;

  @IsUUID()
  routine_id: string;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
