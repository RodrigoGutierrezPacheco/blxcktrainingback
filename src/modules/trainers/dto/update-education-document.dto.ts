import { IsString, IsOptional, MinLength, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateEducationDocumentDto {
  @ApiProperty({
    description: 'Nuevo título del documento de educación',
    example: 'Certificación en Entrenamiento Personal Avanzado',
    minLength: 5,
    maxLength: 200,
    required: false
  })
  @IsOptional()
  @IsString({ message: 'El título debe ser una cadena de texto' })
  @MinLength(5, { message: 'El título debe tener al menos 5 caracteres' })
  @MaxLength(200, { message: 'El título no puede exceder los 200 caracteres' })
  title?: string;

  @ApiProperty({
    description: 'Nueva descripción detallada del documento',
    example: 'Certificación avanzada obtenida en el Instituto Nacional de Deportes con especialización en entrenamiento funcional y rehabilitación deportiva',
    minLength: 10,
    maxLength: 1000,
    required: false
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MinLength(10, { message: 'La descripción debe tener al menos 10 caracteres' })
  @MaxLength(1000, { message: 'La descripción no puede exceder los 1000 caracteres' })
  description?: string;
}
