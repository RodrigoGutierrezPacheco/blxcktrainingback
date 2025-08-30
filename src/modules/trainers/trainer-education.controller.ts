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
  UseGuards,
  Request,
  Query,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { TrainerEducationService } from './trainer-education.service';
import { UploadEducationDocumentDto } from './dto/upload-education-document.dto';
import { UpdateEducationDocumentDto } from './dto/update-education-document.dto';
import { VerifyEducationDocumentDto } from './dto/verify-education-document.dto';
import { TrainerEducationDocument, EducationDocumentStatus } from './entities/trainer-education-document.entity';
import { JwtGuard } from 'src/auth/guards/jwt/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

interface RequestWithUser extends Request {
  user: {
    sub: string;
    email: string;
    role: string;
  };
}

@ApiTags('📚 Documentos de Educación de Entrenadores')
@ApiBearerAuth()
@Controller('trainer-education')
@UseGuards(JwtGuard, RolesGuard)
export class TrainerEducationController {
  constructor(private readonly educationService: TrainerEducationService) {}

  /**
   * Subir un nuevo documento de educación
   * Permite a los entrenadores subir certificaciones, diplomas y otros documentos educativos
   */
  @Post('upload/:trainerId')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Subir documento de educación',
    description: 'Sube un nuevo documento de educación (certificación, diploma, etc.) para un entrenador. El documento se crea con estado "pendiente" por defecto.'
  })
  @ApiParam({
    name: 'trainerId',
    description: 'ID del entrenador',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Datos del documento y archivo',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo del documento (PDF, JPG, PNG, etc.)'
        },
        title: {
          type: 'string',
          description: 'Título del documento',
          example: 'Certificación en Entrenamiento Personal'
        },
        description: {
          type: 'string',
          description: 'Descripción detallada del documento',
          example: 'Certificación obtenida en el Instituto Nacional de Deportes'
        }
      },
      required: ['file', 'title', 'description']
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Documento subido exitosamente',
    type: TrainerEducationDocument
  })
  @ApiResponse({
    status: 400,
    description: 'Error en la validación del archivo o datos'
  })
  @ApiResponse({
    status: 404,
    description: 'Entrenador no encontrado'
  })
  @HttpCode(HttpStatus.CREATED)
  async uploadDocument(
    @Param('trainerId') trainerId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({ fileType: /(pdf|jpg|jpeg|png|doc|docx)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() uploadDto: UploadEducationDocumentDto,
  ): Promise<TrainerEducationDocument> {
    return await this.educationService.uploadDocument(trainerId, file, uploadDto);
  }

  /**
   * Obtener todos los documentos de educación de un entrenador
   * Lista todas las certificaciones, diplomas y documentos educativos de un entrenador específico
   */
  @Get('documents/:trainerId')
  @ApiOperation({
    summary: 'Obtener documentos de educación de un entrenador',
    description: 'Retorna todos los documentos de educación (certificaciones, diplomas, etc.) de un entrenador específico, ordenados por fecha de creación.'
  })
  @ApiParam({
    name: 'trainerId',
    description: 'ID del entrenador',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de documentos obtenida exitosamente',
    type: [TrainerEducationDocument]
  })
  @ApiResponse({
    status: 404,
    description: 'Entrenador no encontrado'
  })
  async getTrainerDocuments(@Param('trainerId') trainerId: string): Promise<TrainerEducationDocument[]> {
    return await this.educationService.getTrainerDocuments(trainerId);
  }

  /**
   * Obtener un documento específico por ID
   * Retorna la información completa de un documento de educación específico
   */
  @Get('document/:documentId')
  @ApiOperation({
    summary: 'Obtener documento de educación por ID',
    description: 'Retorna la información completa de un documento de educación específico, incluyendo detalles del entrenador.'
  })
  @ApiParam({
    name: 'documentId',
    description: 'ID del documento',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @ApiResponse({
    status: 200,
    description: 'Documento obtenido exitosamente',
    type: TrainerEducationDocument
  })
  @ApiResponse({
    status: 404,
    description: 'Documento no encontrado'
  })
  async getDocumentById(@Param('documentId') documentId: string): Promise<TrainerEducationDocument> {
    return await this.educationService.getDocumentById(documentId);
  }

  /**
   * Actualizar información de un documento
   * Permite modificar el título y descripción de un documento no verificado
   */
  @Put('document/:documentId')
  @ApiOperation({
    summary: 'Actualizar documento de educación',
    description: 'Actualiza el título y/o descripción de un documento de educación. Solo se pueden editar documentos no verificados. Al modificar, el estado vuelve a "pendiente".'
  })
  @ApiParam({
    name: 'documentId',
    description: 'ID del documento',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @ApiBody({
    description: 'Datos a actualizar',
    type: UpdateEducationDocumentDto
  })
  @ApiResponse({
    status: 200,
    description: 'Documento actualizado exitosamente',
    type: TrainerEducationDocument
  })
  @ApiResponse({
    status: 400,
    description: 'No se puede editar un documento ya verificado'
  })
  @ApiResponse({
    status: 404,
    description: 'Documento no encontrado'
  })
  async updateDocument(
    @Param('documentId') documentId: string,
    @Body() updateDto: UpdateEducationDocumentDto,
  ): Promise<TrainerEducationDocument> {
    return await this.educationService.updateDocument(documentId, updateDto);
  }

  /**
   * Eliminar un documento
   * Elimina completamente un documento de educación y su archivo asociado
   */
  @Delete('document/:documentId')
  @ApiOperation({
    summary: 'Eliminar documento de educación',
    description: 'Elimina completamente un documento de educación, incluyendo el archivo físico almacenado en Firebase Storage.'
  })
  @ApiParam({
    name: 'documentId',
    description: 'ID del documento',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @ApiResponse({
    status: 200,
    description: 'Documento eliminado exitosamente'
  })
  @ApiResponse({
    status: 404,
    description: 'Documento no encontrado'
  })
  @HttpCode(HttpStatus.OK)
  async deleteDocument(@Param('documentId') documentId: string): Promise<void> {
    return await this.educationService.deleteDocument(documentId);
  }

  /**
   * Verificar un documento (solo administradores)
   * Permite a los administradores cambiar el estado de verificación de un documento
   */
  @Put('verify/:documentId')
  @Roles('admin')
  @ApiOperation({
    summary: 'Verificar documento de educación',
    description: 'Permite a los administradores cambiar el estado de verificación de un documento (pendiente, verificado, rechazado) y agregar comentarios.'
  })
  @ApiParam({
    name: 'documentId',
    description: 'ID del documento',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @ApiBody({
    description: 'Datos de verificación',
    type: VerifyEducationDocumentDto
  })
  @ApiResponse({
    status: 200,
    description: 'Documento verificado exitosamente',
    type: TrainerEducationDocument
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Solo administradores'
  })
  @ApiResponse({
    status: 404,
    description: 'Documento no encontrado'
  })
  async verifyDocument(
    @Param('documentId') documentId: string,
    @Body() verifyDto: VerifyEducationDocumentDto,
    @Request() req: RequestWithUser,
  ): Promise<TrainerEducationDocument> {
    return await this.educationService.verifyDocument(documentId, verifyDto, req.user.sub);
  }

  /**
   * Obtener documentos por estado de verificación
   * Filtra documentos según su estado: pendiente, verificado o rechazado
   */
  @Get('documents/status/:status')
  @Roles('admin')
  @ApiOperation({
    summary: 'Obtener documentos por estado de verificación',
    description: 'Retorna todos los documentos de educación filtrados por su estado de verificación (pendiente, verificado, rechazado). Solo para administradores.'
  })
  @ApiParam({
    name: 'status',
    description: 'Estado de verificación',
    enum: EducationDocumentStatus,
    example: EducationDocumentStatus.PENDIENTE
  })
  @ApiResponse({
    status: 200,
    description: 'Documentos obtenidos exitosamente',
    type: [TrainerEducationDocument]
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Solo administradores'
  })
  async getDocumentsByStatus(@Param('status') status: EducationDocumentStatus): Promise<TrainerEducationDocument[]> {
    return await this.educationService.getDocumentsByStatus(status);
  }

  /**
   * Obtener todos los documentos pendientes
   * Lista todos los documentos que requieren verificación administrativa
   */
  @Get('documents/pending')
  @Roles('admin')
  @ApiOperation({
    summary: 'Obtener documentos pendientes',
    description: 'Retorna todos los documentos de educación que están pendientes de verificación. Solo para administradores.'
  })
  @ApiResponse({
    status: 200,
    description: 'Documentos pendientes obtenidos exitosamente',
    type: [TrainerEducationDocument]
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Solo administradores'
  })
  async getPendingDocuments(): Promise<TrainerEducationDocument[]> {
    return await this.educationService.getPendingDocuments();
  }

  /**
   * Obtener todos los documentos verificados
   * Lista todos los documentos que han sido aprobados por administradores
   */
  @Get('documents/verified')
  @ApiOperation({
    summary: 'Obtener documentos verificados',
    description: 'Retorna todos los documentos de educación que han sido verificados y aprobados por administradores.'
  })
  @ApiResponse({
    status: 200,
    description: 'Documentos verificados obtenidos exitosamente',
    type: [TrainerEducationDocument]
  })
  async getVerifiedDocuments(): Promise<TrainerEducationDocument[]> {
    return await this.educationService.getVerifiedDocuments();
  }

  /**
   * Obtener todos los documentos rechazados
   * Lista todos los documentos que han sido rechazados por administradores
   */
  @Get('documents/rejected')
  @ApiOperation({
    summary: 'Obtener documentos rechazados',
    description: 'Retorna todos los documentos de educación que han sido rechazados por administradores.'
  })
  @ApiResponse({
    status: 200,
    description: 'Documentos rechazados obtenidos exitosamente',
    type: [TrainerEducationDocument]
  })
  async getRejectedDocuments(): Promise<TrainerEducationDocument[]> {
    return await this.educationService.getRejectedDocuments();
  }

  /**
   * Obtener estadísticas de documentos por entrenador
   * Proporciona un resumen cuantitativo de los documentos de un entrenador
   */
  @Get('stats/:trainerId')
  @ApiOperation({
    summary: 'Obtener estadísticas de documentos por entrenador',
    description: 'Retorna estadísticas cuantitativas de los documentos de educación de un entrenador: total, pendientes, verificados y rechazados.'
  })
  @ApiParam({
    name: 'trainerId',
    description: 'ID del entrenador',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas obtenidas exitosamente',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number', example: 5 },
        pending: { type: 'number', example: 2 },
        verified: { type: 'number', example: 2 },
        rejected: { type: 'number', example: 1 }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Entrenador no encontrado'
  })
  async getTrainerDocumentStats(@Param('trainerId') trainerId: string) {
    return await this.educationService.getTrainerDocumentStats(trainerId);
  }

  /**
   * Obtener URL firmada para descargar un documento
   * Genera una URL temporal para acceder al archivo del documento
   */
  @Get('document/:documentId/download')
  @ApiOperation({
    summary: 'Obtener URL de descarga del documento',
    description: 'Genera una URL firmada temporal para descargar o visualizar el archivo del documento de educación.'
  })
  @ApiParam({
    name: 'documentId',
    description: 'ID del documento',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @ApiQuery({
    name: 'expirationMinutes',
    description: 'Tiempo de expiración de la URL en minutos',
    required: false,
    type: Number,
    example: 60
  })
  @ApiResponse({
    status: 200,
    description: 'URL de descarga generada exitosamente',
    schema: {
      type: 'string',
      example: 'https://firebasestorage.googleapis.com/v0/b/project-id/o/...'
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Documento no encontrado'
  })
  async getDocumentSignedUrl(
    @Param('documentId') documentId: string,
    @Query('expirationMinutes') expirationMinutes: number = 60,
  ): Promise<string> {
    return await this.educationService.getDocumentSignedUrl(documentId, expirationMinutes);
  }
}
