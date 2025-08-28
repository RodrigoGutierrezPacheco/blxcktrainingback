import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class VerifyDocumentDto {
  @IsBoolean()
  @IsNotEmpty()
  isVerified: boolean;

  @IsString()
  @IsOptional()
  @MaxLength(1000, { message: 'Los comentarios no pueden exceder 1000 caracteres' })
  verificationNotes?: string;
}
