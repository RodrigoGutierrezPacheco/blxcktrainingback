import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { VerificationStatus } from '../../modules/trainers/entities/trainer-verification-document.entity';

export class VerifyTrainerDocumentDto {
  @IsEnum(VerificationStatus, { message: 'El estado de verificación debe ser: pendiente, rechazada o aceptada' })
  @IsNotEmpty({ message: 'El estado de verificación es requerido' })
  verificationStatus: VerificationStatus;

  @IsString({ message: 'Los comentarios deben ser una cadena de texto' })
  @IsNotEmpty({ message: 'Los comentarios de verificación son requeridos' })
  @MaxLength(1000, { message: 'Los comentarios no pueden tener más de 1000 caracteres' })
  verificationNotes: string;
}
