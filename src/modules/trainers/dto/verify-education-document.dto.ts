import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EducationDocumentStatus } from '../entities/trainer-education-document.entity';

export class VerifyEducationDocumentDto {
  @ApiProperty({
    description: 'Estado de verificación del documento',
    enum: EducationDocumentStatus,
    example: EducationDocumentStatus.VERIFICADO,
    required: true
  })
  @IsEnum(EducationDocumentStatus, { message: 'El estado de verificación debe ser: pendiente, verificado o rechazado' })
  @IsNotEmpty()
  verificationStatus: EducationDocumentStatus;

  @ApiProperty({
    description: 'Comentarios del administrador sobre la verificación',
    example: 'Documento verificado correctamente. Certificación válida y vigente.',
    maxLength: 1000,
    required: false
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000, { message: 'Los comentarios no pueden exceder 1000 caracteres' })
  verificationNotes?: string;
}
