import { IsEnum, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { DocumentType } from "../entities/trainer-verification-document.entity";

export class ReplaceDocumentDto {
  @ApiProperty({
    description: 'Nuevo tipo de documento (opcional, si se desea cambiar)',
    enum: DocumentType,
    example: DocumentType.IDENTIFICATION,
    required: false
  })
  @IsOptional()
  @IsEnum(DocumentType, { message: "El tipo de documento debe ser válido" })
  documentType?: DocumentType;

  @ApiProperty({
    description: 'Notas adicionales sobre el documento reemplazado',
    example: 'Documento anterior expirado, se reemplaza con el vigente',
    required: false
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
