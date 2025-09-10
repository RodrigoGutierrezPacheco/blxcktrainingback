import { IsString, IsOptional, Length, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateExerciseWithImageDto {
  @ApiProperty({
    description: 'Nombre del ejercicio',
    example: 'Press de Banca Inclinado',
    minLength: 3,
    maxLength: 100,
    required: false
  })
  @IsOptional()
  @IsString()
  @Length(3, 100, { message: 'El nombre debe tener entre 3 y 100 caracteres' })
  name?: string;

  @ApiProperty({
    description: 'Descripción detallada del ejercicio',
    example: 'Ejercicio compuesto para el pecho en banco inclinado que involucra pectoral mayor, tríceps y deltoides anteriores.',
    minLength: 10,
    maxLength: 1000,
    required: false
  })
  @IsOptional()
  @IsString()
  @Length(10, 1000, { message: 'La descripción debe tener entre 10 y 1000 caracteres' })
  description?: string;

  @ApiProperty({
    description: 'ID del grupo muscular al que pertenece el ejercicio',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false
  })
  @IsOptional()
  @IsUUID('4', { message: 'El ID del grupo muscular debe ser un UUID válido' })
  muscleGroupId?: string;

  @ApiProperty({
    description: 'Ruta del archivo de imagen en Firebase Storage',
    example: 'Ejercicios/Pecho/press-banca-inclinado.gif',
    required: false
  })
  @IsOptional()
  @IsString()
  imagePath?: string;
}
