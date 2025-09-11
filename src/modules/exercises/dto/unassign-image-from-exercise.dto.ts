import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UnassignImageFromExerciseDto {
  @ApiProperty({
    description: 'ID del ejercicio',
    example: '16505f64-d83c-47f0-8bc9-325a1402debc'
  })
  @IsUUID('4', { message: 'El exerciseId debe ser un UUID válido' })
  exerciseId: string;

  @ApiProperty({
    description: 'ID de la imagen a desasignar',
    example: 'b59d7cbb-87df-4484-b000-4af622e7038b'
  })
  @IsUUID('4', { message: 'El imageId debe ser un UUID válido' })
  imageId: string;
}
