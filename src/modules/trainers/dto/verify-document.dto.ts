import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VerificationStatus } from '../entities/trainer-verification-document.entity';

export class VerifyDocumentDto {
  @ApiProperty({
    description: 'Estado de verificación del documento',
    enum: VerificationStatus,
    example: VerificationStatus.ACEPTADA,
    required: true
  })
  @IsEnum(VerificationStatus, { message: 'El estado de verificación debe ser: pendiente, rechazada o aceptada' })
  @IsNotEmpty()
  verificationStatus: VerificationStatus;

  @ApiProperty({
    description: 'Comentarios del administrador sobre la verificación',
    example: 'Documento verificado correctamente. Información válida y legible.',
    maxLength: 1000,
    required: false
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000, { message: 'Los comentarios no pueden exceder 1000 caracteres' })
  verificationNotes?: string;
}
