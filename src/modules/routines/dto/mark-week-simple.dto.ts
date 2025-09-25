import { IsUUID, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MarkWeekSimpleDto {
  @ApiProperty({
    description: 'ID de la semana a marcar/desmarcar',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @IsUUID(4, { message: 'El ID de la semana debe ser un UUID válido' })
  weekId: string;

  @ApiProperty({
    description: 'Estado de completado de la semana (true = completada, false = no completada)',
    example: true,
    default: true,
    required: false
  })
  @IsOptional()
  @IsBoolean({ message: 'El estado de completado debe ser un valor booleano' })
  isCompleted?: boolean;
}
