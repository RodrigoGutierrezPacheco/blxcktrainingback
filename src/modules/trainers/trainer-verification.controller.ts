import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  Res,
  UseGuards,
  Request,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { TrainerVerificationService } from './trainer-verification.service';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { VerifyDocumentDto } from './dto/verify-document.dto';
import { ReplaceDocumentDto } from './dto/replace-document.dto';
import { JwtGuard } from 'src/auth/guards/jwt/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { DocumentType } from './entities/trainer-verification-document.entity';
import { TrainerVerificationDocument } from './entities/trainer-verification-document.entity';

@Controller('trainer-verification')
@UseGuards(JwtGuard, RolesGuard)
export class TrainerVerificationController {
  constructor(
    private readonly verificationService: TrainerVerificationService,
  ) {}

  // Subir documento de verificación (solo entrenadores)
  @Post('upload/:trainerId')
  @Roles('trainer')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @Param('trainerId') trainerId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({ fileType: '.(pdf|jpg|jpeg|png)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() uploadDto: UploadDocumentDto,
    @Request() req: any,
  ) {
    // Verificar que el entrenador solo puede subir sus propios documentos
    if (req.user.sub !== trainerId && req.user.role !== 'admin') {
      throw new Error('No tienes permisos para subir documentos de otro entrenador');
    }

    return await this.verificationService.uploadDocument(trainerId, file, uploadDto);
  }

  // Reemplazar documento existente (solo entrenadores)
  @Put('replace/:trainerId/:documentType')
  @Roles('trainer')
  @UseInterceptors(FileInterceptor('file'))
  async replaceDocument(
    @Param('trainerId') trainerId: string,
    @Param('documentType') documentType: DocumentType,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({ fileType: '.(pdf|jpg|jpeg|png)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() replaceDto: ReplaceDocumentDto,
    @Request() req: any,
  ) {
    // Verificar que el entrenador solo puede reemplazar sus propios documentos
    if (req.user.sub !== trainerId && req.user.role !== 'admin') {
      throw new Error('No tienes permisos para reemplazar documentos de otro entrenador');
    }

    return await this.verificationService.replaceDocument(trainerId, documentType, file, replaceDto);
  }

  // Obtener todos los documentos de un entrenador
  @Get('documents/:trainerId')
  @Roles('trainer', 'admin')
  async getDocuments(
    @Param('trainerId') trainerId: string,
    @Request() req: any,
  ) {
    // Verificar que el entrenador solo puede ver sus propios documentos
    if (req.user.sub !== trainerId && req.user.role !== 'admin') {
      throw new Error('No tienes permisos para ver documentos de otro entrenador');
    }

    return await this.verificationService.getDocuments(trainerId);
  }

  // Obtener un documento específico
  @Get('document/:documentId/:trainerId')
  @Roles('trainer', 'admin')
  async getDocument(
    @Param('documentId') documentId: string,
    @Param('trainerId') trainerId: string,
    @Request() req: any,
  ) {
    // Verificar que el entrenador solo puede ver sus propios documentos
    if (req.user.sub !== trainerId && req.user.role !== 'admin') {
      throw new Error('No tienes permisos para ver documentos de otro entrenador');
    }

    return await this.verificationService.getDocument(documentId, trainerId);
  }

  // Obtener archivo del documento con URL firmada
  @Get('file/:documentId/:trainerId')
  @Roles('trainer', 'admin')
  async getDocumentFile(
    @Param('documentId') documentId: string,
    @Param('trainerId') trainerId: string,
    @Request() req: any,
  ) {
    // Verificar que el entrenador solo puede ver sus propios documentos
    if (req.user.sub !== trainerId && req.user.role !== 'admin') {
      throw new Error('No tienes permisos para ver documentos de otro entrenador');
    }

    return await this.verificationService.getDocumentFile(documentId, trainerId);
  }

  // Obtener URL firmada para un documento
  @Get('signed-url/:documentId/:trainerId')
  @Roles('trainer', 'admin')
  async getDocumentSignedUrl(
    @Param('documentId') documentId: string,
    @Param('trainerId') trainerId: string,
    @Body('expirationMinutes') expirationMinutes: number = 60,
    @Request() req: any,
  ) {
    // Verificar que el entrenador solo puede ver sus propios documentos
    if (req.user.sub !== trainerId && req.user.role !== 'admin') {
      throw new Error('No tienes permisos para ver documentos de otro entrenador');
    }

    const signedUrl = await this.verificationService.getDocumentSignedUrl(documentId, trainerId, expirationMinutes);
    return { signedUrl };
  }

  // Listar archivos de un entrenador en Firebase Storage
  @Get('files/:trainerId')
  @Roles('trainer', 'admin')
  async listTrainerFiles(
    @Param('trainerId') trainerId: string,
    @Request() req: any,
  ) {
    // Verificar que el entrenador solo puede ver sus propios archivos
    if (req.user.sub !== trainerId && req.user.role !== 'admin') {
      throw new Error('No tienes permisos para ver archivos de otro entrenador');
    }

    const files = await this.verificationService.listTrainerFiles(trainerId);
    return { files, count: files.length };
  }

  // Verificar si un archivo existe en Firebase Storage
  @Get('exists/:trainerId/:filePath')
  @Roles('trainer', 'admin')
  async fileExistsInFirebase(
    @Param('trainerId') trainerId: string,
    @Param('filePath') filePath: string,
    @Request() req: any,
  ) {
    // Verificar que el entrenador solo puede ver sus propios archivos
    if (req.user.sub !== trainerId && req.user.role !== 'admin') {
      throw new Error('No tienes permisos para ver archivos de otro entrenador');
    }

    const fullPath = `Entrenadores/${trainerId}/${filePath}`;
    const exists = await this.verificationService.fileExistsInFirebase(fullPath);
    return { exists, path: fullPath };
  }

  // Eliminar documento
  @Delete(':documentId/:trainerId')
  @Roles('trainer', 'admin')
  async deleteDocument(
    @Param('documentId') documentId: string,
    @Param('trainerId') trainerId: string,
    @Request() req: any,
  ) {
    // Verificar que el entrenador solo puede eliminar sus propios documentos
    if (req.user.sub !== trainerId && req.user.role !== 'admin') {
      throw new Error('No tienes permisos para eliminar documentos de otro entrenador');
    }

    await this.verificationService.deleteDocument(documentId, trainerId);
    return { message: 'Documento eliminado correctamente' };
  }

  // Verificar documento (solo admin)
  @Put('verify/:documentId')
  @Roles('admin')
  async verifyDocument(
    @Param('documentId') documentId: string,
    @Body() verifyDto: VerifyDocumentDto,
    @Request() req: any,
  ) {
    return await this.verificationService.verifyDocument(documentId, verifyDto, req.user.sub);
  }

  // Verificar documento con comentarios detallados (solo admin)
  @Put('verify/:documentId/detailed')
  @Roles('admin')
  async verifyDocumentDetailed(
    @Param('documentId') documentId: string,
    @Body() verifyDto: VerifyDocumentDto,
    @Request() req: any,
  ) {
    const result = await this.verificationService.verifyDocument(documentId, verifyDto, req.user.sub);
    
    return {
      message: verifyDto.isVerified ? 'Documento verificado exitosamente' : 'Documento rechazado',
      document: result,
      verificationDetails: {
        verifiedBy: req.user.sub,
        verifiedAt: result.verifiedAt,
        status: verifyDto.isVerified ? 'APPROVED' : 'REJECTED',
        notes: verifyDto.verificationNotes || 'Sin comentarios'
      }
    };
  }

  // Obtener documentos por estado de verificación
  @Get('status/:status')
  @Roles('admin')
  async getDocumentsByStatus(
    @Param('status') status: 'verified' | 'pending' | 'rejected',
  ) {
    let documents: TrainerVerificationDocument[];
    
    switch (status) {
      case 'verified':
        documents = await this.verificationService.getVerifiedDocuments();
        break;
      case 'pending':
        documents = await this.verificationService.getAllPendingDocuments();
        break;
      case 'rejected':
        documents = await this.verificationService.getRejectedDocuments();
        break;
      default:
        throw new BadRequestException('Estado de verificación inválido');
    }
    
    return {
      status,
      count: documents.length,
      documents
    };
  }

  // Obtener todos los documentos pendientes (solo admin)
  @Get('pending')
  @Roles('admin')
  async getAllPendingDocuments() {
    return await this.verificationService.getAllPendingDocuments();
  }

  // Obtener tipos de documentos disponibles
  @Get('document-types')
  @Roles('trainer', 'admin')
  getDocumentTypes() {
    return Object.values(DocumentType);
  }
}
