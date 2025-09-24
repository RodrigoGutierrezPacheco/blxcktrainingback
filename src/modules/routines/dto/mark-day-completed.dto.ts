import { IsUUID, IsBoolean, IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MarkDayCompletedDto {
  @ApiProperty({
    description: 'ID del día a marcar como completado',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @IsUUID(4, { message: 'El ID del día debe ser un UUID válido' })
  dayId: string;

  @ApiProperty({
    description: 'Estado de completado del día (true = completado, false = no completado)',
    example: true,
    default: true
  })
  @IsBoolean({ message: 'El estado de completado debe ser un valor booleano' })
  isCompleted: boolean;

  @ApiProperty({
    description: 'Notas del usuario sobre el día de entrenamiento',
    example: 'Excelente entrenamiento, me sentí muy fuerte hoy',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Las notas deben ser un texto válido' })
  notes?: string;

  @ApiProperty({
    description: 'Duración del entrenamiento en minutos',
    example: 45,
    required: false
  })
  @IsOptional()
  @IsNumber({}, { message: 'La duración debe ser un número válido' })
  @Min(1, { message: 'La duración mínima es 1 minuto' })
  @Max(480, { message: 'La duración máxima es 480 minutos (8 horas)' })
  durationMinutes?: number;
}
