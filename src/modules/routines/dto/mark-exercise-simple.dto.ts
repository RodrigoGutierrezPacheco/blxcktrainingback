import { IsUUID, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MarkExerciseSimpleDto {
  @ApiProperty({
    description: 'ID del ejercicio a marcar/desmarcar',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @IsUUID(4, { message: 'El ID del ejercicio debe ser un UUID válido' })
  exerciseId: string;

  @ApiProperty({
    description: 'Estado de completado del ejercicio (true = completado, false = no completado)',
    example: true,
    default: true,
    required: false
  })
  @IsOptional()
  @IsBoolean({ message: 'El estado de completado debe ser un valor booleano' })
  isCompleted?: boolean;
}
