import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateMuscleGroupDto {
  @IsString()
  @IsNotEmpty({ message: 'El título es obligatorio' })
  @Length(3, 100, { message: 'El título debe tener entre 3 y 100 caracteres' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  @Length(10, 1000, { message: 'La descripción debe tener entre 10 y 1000 caracteres' })
  description: string;
}
