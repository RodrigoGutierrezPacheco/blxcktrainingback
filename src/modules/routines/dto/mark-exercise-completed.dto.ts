import { IsUUID, IsBoolean, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MarkExerciseCompletedDto {
  @ApiProperty({
    description: 'ID del ejercicio a marcar como completado',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @IsUUID(4, { message: 'El ID del ejercicio debe ser un UUID válido' })
  exerciseId: string;

  @ApiProperty({
    description: 'Estado de completado del ejercicio (true = completado, false = no completado)',
    example: true,
    default: true
  })
  @IsBoolean({ message: 'El estado de completado debe ser un valor booleano' })
  isCompleted: boolean;

  @ApiProperty({
    description: 'Información adicional del progreso (series realizadas, peso usado, etc.)',
    example: {
      setsCompleted: 3,
      weightUsed: 80,
      notes: 'Muy buen ejercicio, pude aumentar el peso'
    },
    required: false
  })
  @IsOptional()
  @IsObject({ message: 'Los datos de progreso deben ser un objeto válido' })
  progressData?: Record<string, any>;
}
