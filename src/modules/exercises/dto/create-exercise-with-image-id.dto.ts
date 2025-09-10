import { IsString, IsNotEmpty, Length, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExerciseWithImageIdDto {
  @ApiProperty({
    description: 'Nombre del ejercicio',
    example: 'Press de Banca',
    minLength: 3,
    maxLength: 100
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre del ejercicio es obligatorio' })
  @Length(3, 100, { message: 'El nombre debe tener entre 3 y 100 caracteres' })
  name: string;

  @ApiProperty({
    description: 'Descripción detallada del ejercicio',
    example: 'Ejercicio compuesto para el pecho que involucra pectoral mayor, tríceps y deltoides anteriores.',
    minLength: 10,
    maxLength: 1000
  })
  @IsString()
  @IsNotEmpty({ message: 'La descripción del ejercicio es obligatoria' })
  @Length(10, 1000, { message: 'La descripción debe tener entre 10 y 1000 caracteres' })
  description: string;

  @ApiProperty({
    description: 'ID del grupo muscular al que pertenece el ejercicio',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID('4', { message: 'El ID del grupo muscular debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID del grupo muscular es obligatorio' })
  muscleGroupId: string;

  @ApiProperty({
    description: 'ID de la imagen en media_assets',
    example: 'ef2e0482-95a2-43e7-a6e8-46450b0ccc2d',
    required: false
  })
  @IsOptional()
  @IsUUID('4', { message: 'El ID de la imagen debe ser un UUID válido' })
  imageId?: string;
}
