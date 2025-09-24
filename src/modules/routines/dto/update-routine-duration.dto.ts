import { IsDateString, IsUUID, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoutineDurationDto {
  @ApiProperty({
    description: 'ID del usuario al que se le cambiará la duración de la rutina',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @IsUUID(4, { message: 'El ID del usuario debe ser un UUID válido' })
  userId: string;

  @ApiProperty({
    description: 'Nueva fecha de inicio de la rutina',
    example: '2024-01-15',
    format: 'date'
  })
  @IsDateString({}, { message: 'La fecha de inicio debe ser una fecha válida en formato ISO (YYYY-MM-DD)' })
  startDate: string;

  @ApiProperty({
    description: 'Nueva fecha de fin de la rutina',
    example: '2024-02-15',
    format: 'date',
    required: false
  })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de fin debe ser una fecha válida en formato ISO (YYYY-MM-DD)' })
  endDate?: string;

  @ApiProperty({
    description: 'Notas adicionales sobre el cambio de duración',
    example: 'Rutina extendida por 2 semanas debido a progreso del usuario',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Las notas deben ser un texto válido' })
  notes?: string;
}
