import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteExerciseByImageDto {
  @ApiProperty({
    description: 'ID de la imagen asociada al ejercicio a eliminar',
    example: 'b59d7cbb-87df-4484-b000-4af622e7038b'
  })
  @IsUUID('4', { message: 'El imageId debe ser un UUID válido' })
  imageId: string;
}
