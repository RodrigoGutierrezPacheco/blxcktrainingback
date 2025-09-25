import { IsUUID, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MarkDaySimpleDto {
  @ApiProperty({
    description: 'ID del día a marcar/desmarcar',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @IsUUID(4, { message: 'El ID del día debe ser un UUID válido' })
  dayId: string;

  @ApiProperty({
    description: 'Estado de completado del día (true = completado, false = no completado)',
    example: true,
    default: true,
    required: false
  })
  @IsOptional()
  @IsBoolean({ message: 'El estado de completado debe ser un valor booleano' })
  isCompleted?: boolean;
}
