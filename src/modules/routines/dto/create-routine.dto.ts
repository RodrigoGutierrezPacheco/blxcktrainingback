import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, ValidateNested, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExerciseDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsUUID()
  exerciseId?: string;

  @IsNumber()
  sets: number;

  @IsNumber()
  repetitions: number;

  @IsNumber()
  restBetweenSets: number;

  @IsNumber()
  restBetweenExercises: number;

  @IsOptional()
  @IsString()
  comments?: string;

  @IsNumber()
  order: number;
}

export class CreateDayDto {
  @IsNumber()
  dayNumber: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  comments?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExerciseDto)
  exercises: CreateExerciseDto[];
}

export class CreateWeekDto {
  @IsNumber()
  weekNumber: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  comments?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDayDto)
  days: CreateDayDto[];
}

export class CreateRoutineDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  comments?: string;

  @IsNumber()
  totalWeeks: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsUUID()
  trainer_id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateWeekDto)
  weeks: CreateWeekDto[];
}
