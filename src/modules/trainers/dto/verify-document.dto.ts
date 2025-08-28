import { IsBoolean, IsOptional, IsString, IsUUID } from "class-validator";

export class VerifyDocumentDto {
  @IsBoolean({ message: "El estado de verificación debe ser un booleano" })
  isVerified: boolean;

  @IsOptional()
  @IsString({ message: "Las notas de verificación deben ser texto" })
  verificationNotes?: string;

  @IsOptional()
  @IsUUID(4, { message: "El ID del admin debe ser un UUID válido" })
  verifiedBy?: string;
}
