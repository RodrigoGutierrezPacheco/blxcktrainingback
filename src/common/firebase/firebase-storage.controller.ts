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
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseStorageService, UploadResult } from './firebase-storage.service';

@Controller('storage')
export class FirebaseStorageController {
  constructor(private readonly firebaseStorageService: FirebaseStorageService) {}

  // Endpoint de prueba para verificar configuración de Firebase
  @Get('test-config')
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
  async listFiles(@Param('folder') folder: string): Promise<string[]> {
    return this.firebaseStorageService.listFiles(folder);
  }

  @Get('metadata/:filePath')
  async getFileMetadata(@Param('filePath') filePath: string) {
    return this.firebaseStorageService.getFileMetadata(filePath);
  }

  @Get('signed-url/:filePath')
  async getSignedUrl(
    @Param('filePath') filePath: string,
    @Body('expirationMinutes') expirationMinutes: number = 60,
  ) {
    return this.firebaseStorageService.getSignedUrl(filePath, expirationMinutes);
  }

  @Delete('file/:filePath')
  async deleteFile(@Param('filePath') filePath: string): Promise<{ success: boolean }> {
    const success = await this.firebaseStorageService.deleteFile(filePath);
    return { success };
  }

  @Get('exists/:filePath')
  async fileExists(@Param('filePath') filePath: string): Promise<{ exists: boolean }> {
    const exists = await this.firebaseStorageService.fileExists(filePath);
    return { exists };
  }
}
