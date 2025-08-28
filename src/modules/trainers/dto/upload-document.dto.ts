import { IsEnum, IsOptional, IsString } from "class-validator";
import { DocumentType } from "../entities/trainer-verification-document.entity";

export class UploadDocumentDto {
  @IsEnum(DocumentType, { message: "El tipo de documento debe ser válido" })
  documentType: DocumentType;

  @IsOptional()
  @IsString()
  notes?: string;
}
