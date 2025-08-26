import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateMuscleGroupDto {
  @IsOptional()
  @IsString()
  @Length(3, 100, { message: 'El título debe tener entre 3 y 100 caracteres' })
  title?: string;

  @IsOptional()
  @IsString()
  @Length(10, 1000, { message: 'La descripción debe tener entre 10 y 1000 caracteres' })
  description?: string;
}
