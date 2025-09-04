import { IsUUID, IsDateString, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReassignRoutineDto {
  @ApiProperty({
    description: 'ID del usuario al que se le reasignará la rutina',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  user_id: string;

  @ApiProperty({
    description: 'ID de la nueva rutina a asignar',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @IsUUID()
  routine_id: string;

  @ApiProperty({
    description: 'Fecha de inicio de la nueva rutina',
    example: '2024-01-15T00:00:00.000Z'
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'Fecha de finalización de la rutina (opcional)',
    example: '2024-04-15T00:00:00.000Z',
    required: false
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    description: 'Notas adicionales sobre la reasignación',
    example: 'Rutina actualizada por cambio de objetivos del usuario',
    required: false
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
