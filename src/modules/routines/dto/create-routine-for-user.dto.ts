import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, ValidateNested, IsUUID, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExerciseForUserDto {
  @ApiProperty({
    description: 'Nombre del ejercicio',
    example: 'Press de banca',
    required: false
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'ID del ejercicio (si existe en la base de datos)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false
  })
  @IsOptional()
  @IsUUID()
  exerciseId?: string;

  @ApiProperty({
    description: 'Número de series',
    example: 3
  })
  @IsNumber()
  sets: number;

  @ApiProperty({
    description: 'Número de repeticiones',
    example: 12
  })
  @IsNumber()
  repetitions: number;

  @ApiProperty({
    description: 'Descanso entre series (en segundos)',
    example: 90
  })
  @IsNumber()
  restBetweenSets: number;

  @ApiProperty({
    description: 'Descanso entre ejercicios (en segundos)',
    example: 120
  })
  @IsNumber()
  restBetweenExercises: number;

  @ApiProperty({
    description: 'Comentarios adicionales del ejercicio',
    example: 'Mantener la espalda recta',
    required: false
  })
  @IsOptional()
  @IsString()
  comments?: string;

  @ApiProperty({
    description: 'Orden del ejercicio en el día',
    example: 1
  })
  @IsNumber()
  order: number;
}

export class CreateDayForUserDto {
  @ApiProperty({
    description: 'Número del día (1-7)',
    example: 1
  })
  @IsNumber()
  dayNumber: number;

  @ApiProperty({
    description: 'Nombre del día',
    example: 'Día de Pecho y Tríceps',
    required: false
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Comentarios del día',
    example: 'Enfoque en la técnica',
    required: false
  })
  @IsOptional()
  @IsString()
  comments?: string;

  @ApiProperty({
    description: 'Lista de ejercicios del día',
    type: [CreateExerciseForUserDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExerciseForUserDto)
  exercises: CreateExerciseForUserDto[];
}

export class CreateWeekForUserDto {
  @ApiProperty({
    description: 'Número de la semana',
    example: 1
  })
  @IsNumber()
  weekNumber: number;

  @ApiProperty({
    description: 'Nombre de la semana',
    example: 'Semana 1 - Adaptación',
    required: false
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Comentarios de la semana',
    example: 'Enfoque en aprender la técnica',
    required: false
  })
  @IsOptional()
  @IsString()
  comments?: string;

  @ApiProperty({
    description: 'Lista de días de la semana',
    type: [CreateDayForUserDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDayForUserDto)
  days: CreateDayForUserDto[];
}

export class CreateRoutineForUserDto {
  @ApiProperty({
    description: 'ID del usuario al que se le creará la rutina',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  user_id: string;

  @ApiProperty({
    description: 'ID del entrenador que crea la rutina',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @IsUUID()
  trainer_id: string;

  @ApiProperty({
    description: 'Nombre de la rutina',
    example: 'Rutina Personalizada para Juan'
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Descripción de la rutina',
    example: 'Rutina personalizada para objetivos específicos del usuario',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Comentarios generales de la rutina',
    example: 'Realizar 3 veces por semana',
    required: false
  })
  @IsOptional()
  @IsString()
  comments?: string;

  @ApiProperty({
    description: 'Número total de semanas de la rutina',
    example: 4
  })
  @IsNumber()
  totalWeeks: number;

  @ApiProperty({
    description: 'Indica si la rutina está activa',
    example: true,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Fecha de inicio de la rutina',
    example: '2024-01-15T00:00:00.000Z'
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'Fecha de finalización de la rutina',
    example: '2024-02-15T00:00:00.000Z',
    required: false
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    description: 'Notas adicionales sobre la rutina',
    example: 'Rutina creada específicamente para este usuario',
    required: false
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Fecha de inicio sugerida para la rutina',
    example: '2024-01-15T00:00:00.000Z',
    required: false
  })
  @IsOptional()
  @IsDateString()
  suggestedStartDate?: string;

  @ApiProperty({
    description: 'Fecha de finalización sugerida para la rutina',
    example: '2024-03-15T00:00:00.000Z',
    required: false
  })
  @IsOptional()
  @IsDateString()
  suggestedEndDate?: string;

  @ApiProperty({
    description: 'Lista de semanas de la rutina',
    type: [CreateWeekForUserDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateWeekForUserDto)
  weeks: CreateWeekForUserDto[];
}
