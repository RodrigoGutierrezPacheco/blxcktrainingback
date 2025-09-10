import { IsString, IsNotEmpty, Length, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExerciseWithImageDto {
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
    example: 'Ejercicio compuesto para el pecho que involucra pectoral mayor, tríceps y deltoides anteriores. Se realiza acostado en un banco plano.',
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
    description: 'Ruta del archivo de imagen en Firebase Storage',
    example: 'Ejercicios/Pecho/press-banca.gif',
    required: false
  })
  @IsOptional()
  @IsString()
  imagePath?: string;
}
