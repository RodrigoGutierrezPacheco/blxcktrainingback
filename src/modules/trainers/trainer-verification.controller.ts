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

  /**
   * 🔗 OBTENER URL FIRMADA PARA UN DOCUMENTO
   * 
   * ¿Para qué sirve?
   * Este endpoint genera una URL temporal y segura que permite acceder a un documento
   * durante un tiempo limitado, ideal para compartir documentos de forma segura.
   * 
   * ¿Cuándo se usa?
   * - Compartir documentos con terceros temporalmente
   * - Integración con sistemas externos
   * - Enlaces temporales en emails
   * - Acceso controlado por tiempo
   * 
   * ¿Qué hace?
   * - Genera URL firmada con tiempo de expiración configurable
   * - Por defecto expira en 60 minutos
   * - Permite acceso seguro sin autenticación adicional
   * - Controla el acceso temporal al archivo
   */
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

  /**
   * 📂 LISTAR ARCHIVOS DE UN ENTRENADOR EN FIREBASE STORAGE
   * 
   * ¿Para qué sirve?
   * Este endpoint proporciona una vista completa de todos los archivos almacenados
   * en Firebase Storage para un entrenador específico, útil para auditorías y gestión.
   * 
   * ¿Cuándo se usa?
   * - Auditorías de almacenamiento
   * - Verificación de archivos duplicados
   * - Limpieza de archivos obsoletos
   * - Reportes de uso de almacenamiento
   * 
   * ¿Qué hace?
   * - Lista todos los archivos del entrenador en Firebase
   * - Proporciona conteo total de archivos
   * - Verifica permisos de acceso
   * - Muestra estructura de archivos
   */
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

  /**
   * ✅ VERIFICAR SI UN ARCHIVO EXISTE EN FIREBASE STORAGE
   * 
   * ¿Para qué sirve?
   * Este endpoint verifica la existencia de un archivo específico en Firebase Storage,
   * útil para validaciones antes de operaciones de archivo.
   * 
   * ¿Cuándo se usa?
   * - Validar existencia antes de eliminar
   * - Verificar integridad de archivos
   * - Prevenir errores en operaciones de archivo
   * - Auditorías de sincronización
   * 
   * ¿Qué hace?
   * - Verifica si el archivo existe en la ruta especificada
   * - Retorna estado de existencia (true/false)
   * - Incluye la ruta completa verificada
   * - Útil para debugging y validaciones
   */
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

  /**
   * 🗑️ ELIMINAR DOCUMENTO
   * 
   * ¿Para qué sirve?
   * Este endpoint permite eliminar permanentemente un documento de verificación,
   * tanto de la base de datos como del almacenamiento de Firebase.
   * 
   * ¿Cuándo se usa?
   * - Documentos obsoletos o incorrectos
   * - Solicitud de eliminación del entrenador
   * - Limpieza de archivos duplicados
   * - Cumplimiento de solicitudes de privacidad
   * 
   * ¿Qué hace?
   * - Elimina el registro de la base de datos
   * - Borra el archivo físico de Firebase Storage
   * - Verifica permisos antes de eliminar
   * - Solo el entrenador o administradores pueden eliminar
   */
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

  /**
   * ✅ VERIFICAR DOCUMENTO (SOLO ADMIN)
   * 
   * ¿Para qué sirve?
   * Este endpoint permite a los administradores cambiar el estado de verificación
   * de un documento, aprobándolo, rechazándolo o marcándolo como pendiente.
   * 
   * ¿Cuándo se usa?
   * - Administradores revisando documentos
   * - Aprobación de identidad del entrenador
   * - Rechazo por documentos inválidos
   * - Cambio de estado de verificación
   * 
   * ¿Qué hace?
   * - Cambia el estado de verificación del documento
   * - Registra quién realizó la verificación
   * - Guarda la fecha de verificación
   * - Permite agregar comentarios explicativos
   * - Solo administradores pueden usar este endpoint
   */
  @Put('verify/:documentId')
  @Roles('admin')
  async verifyDocument(
    @Param('documentId') documentId: string,
    @Body() verifyDto: VerifyDocumentDto,
    @Request() req: any,
  ) {
    return await this.verificationService.verifyDocument(documentId, verifyDto, req.user.sub);
  }

  /**
   * 📝 VERIFICAR DOCUMENTO CON COMENTARIOS DETALLADOS (SOLO ADMIN)
   * 
   * ¿Para qué sirve?
   * Este endpoint es una versión extendida del anterior que permite a los administradores
   * proporcionar comentarios detallados sobre la verificación, útil para auditorías.
   * 
   * ¿Cuándo se usa?
   * - Verificaciones que requieren explicación detallada
   * - Auditorías de cumplimiento
   * - Comunicación con entrenadores sobre su documentación
   * - Historial de decisiones de verificación
   * 
   * ¿Qué hace?
   * - Cambia el estado de verificación
   * - Permite comentarios extensos (hasta 1000 caracteres)
   * - Registra detalles completos de la verificación
   * - Proporciona respuesta estructurada con detalles
   * - Mantiene historial completo de la decisión
   */
  @Put('verify/:documentId/detailed')
  @Roles('admin')
  async verifyDocumentDetailed(
    @Param('documentId') documentId: string,
    @Body() verifyDto: VerifyDocumentDto,
    @Request() req: any,
  ) {
    const result = await this.verificationService.verifyDocument(documentId, verifyDto, req.user.sub);
    
    const statusMessage = verifyDto.verificationStatus === 'aceptada' 
      ? 'Documento verificado exitosamente' 
      : verifyDto.verificationStatus === 'rechazada' 
        ? 'Documento rechazado' 
        : 'Documento marcado como pendiente';
    
    return {
      message: statusMessage,
      document: result,
      verificationDetails: {
        verifiedBy: req.user.sub,
        verifiedAt: result.verifiedAt,
        status: verifyDto.verificationStatus.toUpperCase(),
        notes: verifyDto.verificationNotes || 'Sin comentarios'
      }
    };
  }

  /**
   * 📊 OBTENER DOCUMENTOS POR ESTADO DE VERIFICACIÓN
   * 
   * ¿Para qué sirve?
   * Este endpoint permite filtrar documentos según su estado de verificación
   * (verificado, pendiente, rechazado), útil para administradores y reportes.
   * 
   * ¿Cuándo se usa?
   * - Administradores revisando documentos pendientes
   * - Reportes de estado de verificación
   * - Auditorías de cumplimiento
   * - Seguimiento de procesos de verificación
   * 
   * ¿Qué hace?
   * - Filtra documentos por estado específico
   * - Proporciona conteo total de documentos
   * - Lista todos los documentos del estado seleccionado
   * - Solo administradores pueden acceder
   * - Estados válidos: 'verified', 'pending', 'rejected'
   */
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

  /**
   * ⏳ OBTENER TODOS LOS DOCUMENTOS PENDIENTES (SOLO ADMIN)
   * 
   * ¿Para qué sirve?
   * Este endpoint proporciona acceso directo a todos los documentos que están
   * pendientes de verificación, facilitando el trabajo de los administradores.
   * 
   * ¿Cuándo se usa?
   * - Panel de administración principal
   * - Revisión diaria de documentos nuevos
   * - Asignación de tareas de verificación
   * - Reportes de carga de trabajo
   * 
   * ¿Qué hace?
   * - Lista todos los documentos pendientes
   * - Ordenados por fecha de creación
   * - Incluye información completa de cada documento
   * - Solo administradores pueden acceder
   * - Útil para gestión de cola de verificación
   */
  @Get('pending')
  @Roles('admin')
  async getAllPendingDocuments() {
    return await this.verificationService.getAllPendingDocuments();
  }

  /**
   * 📋 OBTENER TIPOS DE DOCUMENTOS DISPONIBLES
   * 
   * ¿Para qué sirve?
   * Este endpoint proporciona la lista de todos los tipos de documentos
   * que pueden ser subidos por los entrenadores para verificación.
   * 
   * ¿Cuándo se usa?
   * - Formularios de subida de documentos
   * - Validación de tipos de documento
   * - Interfaz de usuario dinámica
   * - Documentación de API
   * 
   * ¿Qué hace?
   * - Retorna array con todos los tipos disponibles
   * - Incluye: identification, birth_certificate, CURP, RFC
   * - Accesible para entrenadores y administradores
   * - Útil para construir formularios dinámicos
   */
  @Get('document-types')
  @Roles('trainer', 'admin')
  getDocumentTypes() {
    return Object.values(DocumentType);
  }
}
