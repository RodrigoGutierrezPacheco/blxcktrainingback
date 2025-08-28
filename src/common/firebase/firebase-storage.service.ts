import { Injectable, Logger } from '@nestjs/common';
import { FirebaseConfig } from './firebase.config';
import * as admin from 'firebase-admin';

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

export interface FileMetadata {
  contentType: string;
  size: number;
  name: string;
  path: string;
}

@Injectable()
export class FirebaseStorageService {
  private readonly logger = new Logger(FirebaseStorageService.name);

  constructor(public readonly firebaseConfig: FirebaseConfig) {}

  /**
   * Upload a file to Firebase Storage
   */
  async uploadFile(
    file: Express.Multer.File,
    destinationPath: string,
    metadata?: any
  ): Promise<UploadResult> {
    try {
      const bucket = this.firebaseConfig.getBucket();
      const fileUpload = bucket.file(destinationPath);

      const uploadOptions: any = {
        metadata: {
          contentType: file.mimetype,
          ...metadata,
        },
        resumable: false,
      };

      await fileUpload.save(file.buffer, uploadOptions);

      // Make the file publicly accessible (optional)
      await fileUpload.makePublic();

      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destinationPath}`;

      this.logger.log(`File uploaded successfully: ${destinationPath}`);

      return {
        success: true,
        url: publicUrl,
        path: destinationPath,
      };
    } catch (error) {
      this.logger.error(`Error uploading file: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Upload a file with custom filename and path
   */
  async uploadFileWithCustomName(
    file: Express.Multer.File,
    folder: string,
    customName?: string
  ): Promise<UploadResult> {
    const fileName = customName || `${Date.now()}-${file.originalname}`;
    const destinationPath = `${folder}/${fileName}`;
    
    return this.uploadFile(file, destinationPath);
  }

  /**
   * Delete a file from Firebase Storage
   */
  async deleteFile(filePath: string): Promise<boolean> {
    try {
      const bucket = this.firebaseConfig.getBucket();
      const file = bucket.file(filePath);
      
      await file.delete();
      
      this.logger.log(`File deleted successfully: ${filePath}`);
      return true;
    } catch (error) {
      this.logger.error(`Error deleting file: ${error.message}`);
      return false;
    }
  }

  /**
   * Get file metadata
   */
  async getFileMetadata(filePath: string): Promise<FileMetadata | null> {
    try {
      const bucket = this.firebaseConfig.getBucket();
      const file = bucket.file(filePath);
      
      const [metadata] = await file.getMetadata();
      
      return {
        contentType: metadata.contentType,
        size: parseInt(metadata.size),
        name: metadata.name,
        path: filePath,
      };
    } catch (error) {
      this.logger.error(`Error getting file metadata: ${error.message}`);
      return null;
    }
  }

  /**
   * Get signed URL for temporary access
   */
  async getSignedUrl(filePath: string, expirationMinutes: number = 60): Promise<string | null> {
    try {
      const bucket = this.firebaseConfig.getBucket();
      const file = bucket.file(filePath);
      
      const [signedUrl] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + expirationMinutes * 60 * 1000,
      });
      
      return signedUrl;
    } catch (error) {
      this.logger.error(`Error generating signed URL: ${error.message}`);
      return null;
    }
  }

  /**
   * List files in a folder
   */
  async listFiles(folderPath: string): Promise<string[]> {
    try {
      const bucket = this.firebaseConfig.getBucket();
      const [files] = await bucket.getFiles({ prefix: folderPath });
      
      return files.map(file => file.name);
    } catch (error) {
      this.logger.error(`Error listing files: ${error.message}`);
      return [];
    }
  }

  /**
   * Check if file exists
   */
  async fileExists(filePath: string): Promise<boolean> {
    try {
      const bucket = this.firebaseConfig.getBucket();
      const file = bucket.file(filePath);
      
      const [exists] = await file.exists();
      return exists;
    } catch (error) {
      this.logger.error(`Error checking file existence: ${error.message}`);
      return false;
    }
  }
}
