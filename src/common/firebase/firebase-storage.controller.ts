import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  Body,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseStorageService, UploadResult } from './firebase-storage.service';

@ApiTags('☁️ Firebase Storage')
@ApiBearerAuth()
@Controller('storage')
export class FirebaseStorageController {
  constructor(private readonly firebaseStorageService: FirebaseStorageService) {}

  // Endpoint de prueba para verificar configuración de Firebase
  @Get('test-config')
  @ApiOperation({
    summary: 'Probar Configuración de Firebase',
    description: 'Verifica que la configuración de Firebase Storage esté funcionando correctamente.'
  })
  @ApiResponse({
    status: 200,
    description: 'Configuración de Firebase verificada exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Firebase configurado correctamente' },
        bucketName: { type: 'string', example: 'proyecto-ejemplo.appspot.com' },
        projectId: { type: 'string', example: 'proyecto-ejemplo' },
        storageBucket: { type: 'string', example: 'proyecto-ejemplo.appspot.com' },
        timestamp: { type: 'string', example: '2024-01-15T10:00:00.000Z' }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Error en la configuración de Firebase',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        error: { type: 'string', example: 'Error de configuración' },
        projectId: { type: 'string', example: 'proyecto-ejemplo' },
        storageBucket: { type: 'string', example: 'proyecto-ejemplo.appspot.com' },
        timestamp: { type: 'string', example: '2024-01-15T10:00:00.000Z' }
      }
    }
  })
  async testFirebaseConfig() {
    try {
      // Verificar si podemos acceder al bucket
      const bucket = this.firebaseStorageService['firebaseConfig'].getBucket();
      
      return {
        success: true,
        message: 'Firebase configurado correctamente',
        bucketName: bucket.name,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        timestamp: new Date().toISOString()
      };
    }
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Subir Archivo',
    description: 'Sube un archivo al almacenamiento de Firebase. Tamaño máximo: 10MB. Tipos permitidos: jpg, jpeg, png, gif, pdf, doc, docx.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo a subir (máximo 10MB)'
        },
        folder: {
          type: 'string',
          description: 'Carpeta donde guardar el archivo',
          example: 'uploads',
          default: 'uploads'
        },
        customName: {
          type: 'string',
          description: 'Nombre personalizado para el archivo (opcional)',
          example: 'mi-archivo.jpg'
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Archivo subido exitosamente',
    schema: {
      type: 'object',
      properties: {
        url: { type: 'string', example: 'https://storage.googleapis.com/bucket/archivo.jpg' },
        fileName: { type: 'string', example: 'archivo.jpg' },
        filePath: { type: 'string', example: 'uploads/archivo.jpg' },
        size: { type: 'number', example: 1024000 },
        contentType: { type: 'string', example: 'image/jpeg' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Archivo inválido o demasiado grande' })
  @ApiResponse({ status: 413, description: 'Archivo demasiado grande (máximo 10MB)' })
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|pdf|doc|docx)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body('folder') folder: string = 'uploads',
    @Body('customName') customName?: string,
  ): Promise<UploadResult> {
    return this.firebaseStorageService.uploadFileWithCustomName(
      file,
      folder,
      customName,
    );
  }

  @Post('upload/:folder')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Subir Archivo a Carpeta Específica',
    description: 'Sube un archivo a una carpeta específica en Firebase Storage. Tamaño máximo: 10MB. Tipos permitidos: jpg, jpeg, png, gif, pdf, doc, docx.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'folder',
    description: 'Carpeta donde guardar el archivo',
    example: 'trainer-verification',
    required: true
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo a subir (máximo 10MB)'
        },
        customName: {
          type: 'string',
          description: 'Nombre personalizado para el archivo (opcional)',
          example: 'identificacion.jpg'
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Archivo subido exitosamente',
    schema: {
      type: 'object',
      properties: {
        url: { type: 'string', example: 'https://storage.googleapis.com/bucket/trainer-verification/identificacion.jpg' },
        fileName: { type: 'string', example: 'identificacion.jpg' },
        filePath: { type: 'string', example: 'trainer-verification/identificacion.jpg' },
        size: { type: 'number', example: 1024000 },
        contentType: { type: 'string', example: 'image/jpeg' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Archivo inválido o demasiado grande' })
  @ApiResponse({ status: 413, description: 'Archivo demasiado grande (máximo 10MB)' })
  async uploadFileToFolder(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|pdf|doc|docx)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('folder') folder: string,
    @Body('customName') customName?: string,
  ): Promise<UploadResult> {
    return this.firebaseStorageService.uploadFileWithCustomName(
      file,
      folder,
      customName,
    );
  }

  @Get('files/:folder')
  @ApiOperation({
    summary: 'Listar Archivos en Carpeta',
    description: 'Obtiene la lista de todos los archivos en una carpeta específica de Firebase Storage.'
  })
  @ApiParam({
    name: 'folder',
    description: 'Carpeta de la cual listar archivos',
    example: 'trainer-verification',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de archivos obtenida exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'string',
        example: 'identificacion.jpg'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Carpeta no encontrada' })
  async listFiles(@Param('folder') folder: string): Promise<string[]> {
    return this.firebaseStorageService.listFiles(folder);
  }

  @Get('metadata/:filePath')
  @ApiOperation({
    summary: 'Obtener Metadatos de Archivo',
    description: 'Obtiene los metadatos de un archivo específico en Firebase Storage.'
  })
  @ApiParam({
    name: 'filePath',
    description: 'Ruta completa del archivo',
    example: 'trainer-verification/identificacion.jpg',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Metadatos del archivo obtenidos exitosamente',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'identificacion.jpg' },
        bucket: { type: 'string', example: 'proyecto-ejemplo.appspot.com' },
        contentType: { type: 'string', example: 'image/jpeg' },
        size: { type: 'number', example: 1024000 },
        timeCreated: { type: 'string', example: '2024-01-15T10:00:00.000Z' },
        updated: { type: 'string', example: '2024-01-15T10:00:00.000Z' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Archivo no encontrado' })
  async getFileMetadata(@Param('filePath') filePath: string) {
    return this.firebaseStorageService.getFileMetadata(filePath);
  }

  @Get('signed-url/:filePath')
  @ApiOperation({
    summary: 'Obtener URL Firmada',
    description: 'Genera una URL firmada temporal para acceder a un archivo privado en Firebase Storage.'
  })
  @ApiParam({
    name: 'filePath',
    description: 'Ruta completa del archivo',
    example: 'trainer-verification/identificacion.jpg',
    required: true
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        expirationMinutes: {
          type: 'number',
          description: 'Minutos hasta que expire la URL (por defecto: 60)',
          example: 60,
          default: 60
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'URL firmada generada exitosamente',
    schema: {
      type: 'object',
      properties: {
        signedUrl: { type: 'string', example: 'https://storage.googleapis.com/bucket/archivo.jpg?X-Goog-Algorithm=...' },
        expirationTime: { type: 'string', example: '2024-01-15T11:00:00.000Z' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Archivo no encontrado' })
  async getSignedUrl(
    @Param('filePath') filePath: string,
    @Body('expirationMinutes') expirationMinutes: number = 60,
  ) {
    return this.firebaseStorageService.getSignedUrl(filePath, expirationMinutes);
  }

  @Delete('file/:filePath')
  @ApiOperation({
    summary: 'Eliminar Archivo',
    description: 'Elimina un archivo específico de Firebase Storage.'
  })
  @ApiParam({
    name: 'filePath',
    description: 'Ruta completa del archivo a eliminar',
    example: 'trainer-verification/identificacion.jpg',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Archivo eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Archivo no encontrado' })
  async deleteFile(@Param('filePath') filePath: string): Promise<{ success: boolean }> {
    const success = await this.firebaseStorageService.deleteFile(filePath);
    return { success };
  }

  @Get('exists/:filePath')
  @ApiOperation({
    summary: 'Verificar Existencia de Archivo',
    description: 'Verifica si un archivo específico existe en Firebase Storage.'
  })
  @ApiParam({
    name: 'filePath',
    description: 'Ruta completa del archivo a verificar',
    example: 'trainer-verification/identificacion.jpg',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Verificación completada exitosamente',
    schema: {
      type: 'object',
      properties: {
        exists: { type: 'boolean', example: true }
      }
    }
  })
  async fileExists(@Param('filePath') filePath: string): Promise<{ exists: boolean }> {
    const exists = await this.firebaseStorageService.fileExists(filePath);
    return { exists };
  }
}
