import { IsString, IsNotEmpty, Length, IsUUID, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ImageDto {
  @IsString()
  @IsNotEmpty({ message: 'El tipo de imagen es obligatorio' })
  type: string;

  @IsString()
  @IsNotEmpty({ message: 'La URL de la imagen es obligatoria' })
  url: string;
}

export class CreateExerciseDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del ejercicio es obligatorio' })
  @Length(3, 100, { message: 'El nombre debe tener entre 3 y 100 caracteres' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción del ejercicio es obligatoria' })
  @Length(10, 1000, { message: 'La descripción debe tener entre 10 y 1000 caracteres' })
  description: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ImageDto)
  image?: ImageDto;

  @IsUUID('4', { message: 'El ID del grupo muscular debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID del grupo muscular es obligatorio' })
  muscleGroupId: string;
}
