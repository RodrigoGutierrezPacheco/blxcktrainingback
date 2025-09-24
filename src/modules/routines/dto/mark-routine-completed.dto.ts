import { IsUUID, IsBoolean, IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MarkRoutineCompletedDto {
  @ApiProperty({
    description: 'ID de la rutina a marcar como completada',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @IsUUID(4, { message: 'El ID de la rutina debe ser un UUID válido' })
  routineId: string;

  @ApiProperty({
    description: 'Estado de completado de la rutina (true = completada, false = no completada)',
    example: true,
    default: true
  })
  @IsBoolean({ message: 'El estado de completado debe ser un valor booleano' })
  isCompleted: boolean;

  @ApiProperty({
    description: 'Notas del usuario sobre la rutina completa',
    example: '¡Rutina completada con éxito! Me siento mucho más fuerte y saludable',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Las notas deben ser un texto válido' })
  notes?: string;

  @ApiProperty({
    description: 'Total de minutos entrenados en toda la rutina',
    example: 720,
    required: false
  })
  @IsOptional()
  @IsNumber({}, { message: 'El total de minutos debe ser un número válido' })
  @Min(1, { message: 'El total mínimo es 1 minuto' })
  @Max(10000, { message: 'El total máximo es 10000 minutos' })
  totalMinutes?: number;
}
