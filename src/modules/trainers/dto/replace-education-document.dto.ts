import { IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ReplaceEducationDocumentDto {
  @ApiProperty({
    description: 'Notas adicionales sobre el documento reemplazado',
    example: 'Documento anterior expirado, se reemplaza con el vigente',
    required: false
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
