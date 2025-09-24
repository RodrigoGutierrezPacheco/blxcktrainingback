import { IsUUID, IsBoolean, IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MarkWeekCompletedDto {
  @ApiProperty({
    description: 'ID de la semana a marcar como completada',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @IsUUID(4, { message: 'El ID de la semana debe ser un UUID válido' })
  weekId: string;

  @ApiProperty({
    description: 'Estado de completado de la semana (true = completada, false = no completada)',
    example: true,
    default: true
  })
  @IsBoolean({ message: 'El estado de completado debe ser un valor booleano' })
  isCompleted: boolean;

  @ApiProperty({
    description: 'Notas del usuario sobre la semana de entrenamiento',
    example: 'Semana muy productiva, logré todos mis objetivos',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Las notas deben ser un texto válido' })
  notes?: string;

  @ApiProperty({
    description: 'Total de minutos entrenados en la semana',
    example: 180,
    required: false
  })
  @IsOptional()
  @IsNumber({}, { message: 'El total de minutos debe ser un número válido' })
  @Min(1, { message: 'El total mínimo es 1 minuto' })
  @Max(2400, { message: 'El total máximo es 2400 minutos (40 horas)' })
  totalMinutes?: number;
}
