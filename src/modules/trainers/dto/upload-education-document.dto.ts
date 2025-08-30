import { IsString, IsNotEmpty, MinLength, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UploadEducationDocumentDto {
  @ApiProperty({
    description: 'Título del documento de educación',
    example: 'Certificación en Entrenamiento Personal',
    minLength: 5,
    maxLength: 200
  })
  @IsString({ message: 'El título debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El título es obligatorio' })
  @MinLength(5, { message: 'El título debe tener al menos 5 caracteres' })
  @MaxLength(200, { message: 'El título no puede exceder los 200 caracteres' })
  title: string;

  @ApiProperty({
    description: 'Descripción detallada del documento',
    example: 'Certificación obtenida en el Instituto Nacional de Deportes con especialización en entrenamiento funcional',
    minLength: 10,
    maxLength: 1000
  })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  @MinLength(10, { message: 'La descripción debe tener al menos 10 caracteres' })
  @MaxLength(1000, { message: 'La descripción no puede exceder los 1000 caracteres' })
  description: string;
}
