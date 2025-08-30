import { IsEnum, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { DocumentType } from "../entities/trainer-verification-document.entity";

export class UploadDocumentDto {
  @ApiProperty({
    description: 'Tipo de documento de verificación',
    enum: DocumentType,
    example: DocumentType.IDENTIFICATION,
    required: true
  })
  @IsEnum(DocumentType, { message: "El tipo de documento debe ser válido" })
  documentType: DocumentType;

  @ApiProperty({
    description: 'Notas adicionales sobre el documento',
    example: 'Documento de identificación oficial vigente',
    required: false
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
