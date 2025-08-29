import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { VerificationStatus } from '../entities/trainer-verification-document.entity';

export class VerifyDocumentDto {
  @IsEnum(VerificationStatus, { message: 'El estado de verificación debe ser: pendiente, rechazada o aceptada' })
  @IsNotEmpty()
  verificationStatus: VerificationStatus;

  @IsString()
  @IsOptional()
  @MaxLength(1000, { message: 'Los comentarios no pueden exceder 1000 caracteres' })
  verificationNotes?: string;
}
