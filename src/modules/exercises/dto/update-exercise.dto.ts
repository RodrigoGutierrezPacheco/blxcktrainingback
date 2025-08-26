import { IsOptional, IsString, Length, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ImageDto {
  @IsString()
  type: string;

  @IsString()
  url: string;
}

export class UpdateExerciseDto {
  @IsOptional()
  @IsString()
  @Length(3, 100, { message: 'El nombre debe tener entre 3 y 100 caracteres' })
  name?: string;

  @IsOptional()
  @IsString()
  @Length(10, 1000, { message: 'La descripción debe tener entre 10 y 1000 caracteres' })
  description?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ImageDto)
  image?: ImageDto;

  @IsOptional()
  @IsUUID('4', { message: 'El ID del grupo muscular debe ser un UUID válido' })
  muscleGroupId?: string;
}
