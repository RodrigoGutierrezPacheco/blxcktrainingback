import { Injectable } from '@nestjs/common';
import { FirebaseStorageService, UploadResult } from 'src/common/firebase';

interface TrainerDocumentInfo {
  path: string;
  name: string;
  size: number;
  contentType: string;
  signedUrl: string | null;
  permanentUrl: string;
}

interface TrainerStats {
  trainerId: string;
  documentCount: number;
  totalSize: number;
}

interface DocumentsStats {
  totalTrainers: number;
  totalDocuments: number;
  totalSize: number;
  trainersWithDocuments: TrainerStats[];
}

@Injectable()
export class TrainerFirebaseExampleService {
  constructor(private readonly firebaseStorage: FirebaseStorageService) {}

  /**
   * Ejemplo: Subir documento de identificación del entrenador
   */
  async uploadIdentificationDocument(
    trainerId: string,
    file: Express.Multer.File
  ): Promise<UploadResult> {
    const folder = 'Entrenadores';
    const customName = `identification_${trainerId}_${Date.now()}.${file.originalname.split('.').pop()}`;
    
    return this.firebaseStorage.uploadFileWithCustomName(
      file,
      folder,
      customName
    );
  }

  /**
   * Ejemplo: Subir certificado de nacimiento
   */
  async uploadBirthCertificate(
    trainerId: string,
    file: Express.Multer.File
  ): Promise<UploadResult> {
    const folder = 'Entrenadores';
    const customName = `birth_certificate_${trainerId}_${Date.now()}.${file.originalname.split('.').pop()}`;
    
    return this.firebaseStorage.uploadFileWithCustomName(
      file,
      folder,
      customName
    );
  }

  /**
   * Ejemplo: Subir CURP
   */
  async uploadCURP(
    trainerId: string,
    file: Express.Multer.File
  ): Promise<UploadResult> {
    const folder = 'Entrenadores';
    const customName = `curp_${trainerId}_${Date.now()}.${file.originalname.split('.').pop()}`;
    
    return this.firebaseStorage.uploadFileWithCustomName(
      file,
      folder,
      customName
    );
  }

  /**
   * Ejemplo: Subir RFC
   */
  async uploadRFC(
    trainerId: string,
    file: Express.Multer.File
  ): Promise<UploadResult> {
    const folder = 'Entrenadores';
    const customName = `rfc_${trainerId}_${Date.now()}.${file.originalname.split('.').pop()}`;
    
    return this.firebaseStorage.uploadFileWithCustomName(
      file,
      folder,
      customName
    );
  }

  /**
   * Ejemplo: Organizar documentos por entrenador en subcarpetas
   */
  async uploadDocumentToTrainerFolder(
    trainerId: string,
    documentType: string,
    file: Express.Multer.File
  ): Promise<UploadResult> {
    const folder = `Entrenadores/${trainerId}`;
    const customName = `${documentType}_${Date.now()}.${file.originalname.split('.').pop()}`;
    
    return this.firebaseStorage.uploadFileWithCustomName(
      file,
      folder,
      customName
    );
  }

  /**
   * Ejemplo: Limpiar todos los documentos de un entrenador
   */
  async cleanupTrainerDocuments(trainerId: string): Promise<boolean> {
    try {
      const folderPath = `Entrenadores/${trainerId}`;
      const files = await this.firebaseStorage.listFiles(folderPath);
      
      // Eliminar todos los archivos del entrenador
      for (const filePath of files) {
        await this.firebaseStorage.deleteFile(filePath);
      }
      
      return true;
    } catch (error) {
      console.error('Error limpiando documentos del entrenador:', error);
      return false;
    }
  }

  /**
   * Ejemplo: Obtener información de todos los documentos de un entrenador
   */
  async getTrainerDocumentsInfo(trainerId: string): Promise<TrainerDocumentInfo[]> {
    const folderPath = `Entrenadores/${trainerId}`;
    const files = await this.firebaseStorage.listFiles(folderPath);
    
    const documentsInfo: TrainerDocumentInfo[] = [];
    
    for (const filePath of files) {
      const metadata = await this.firebaseStorage.getFileMetadata(filePath);
      const signedUrl = await this.firebaseStorage.getSignedUrl(filePath, 60); // 1 hora
      
      if (metadata) {
        documentsInfo.push({
          path: filePath,
          name: metadata.name,
          size: metadata.size,
          contentType: metadata.contentType,
          signedUrl,
          permanentUrl: `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${filePath}`
        });
      }
    }
    
    return documentsInfo;
  }

  /**
   * Ejemplo: Validar tipo de documento antes de subir
   */
  validateDocumentFile(file: Express.Multer.File, allowedTypes: string[]): { valid: boolean; error?: string } {
    // Verificar tipo de archivo
    if (!allowedTypes.includes(file.mimetype)) {
      return { 
        valid: false, 
        error: `Tipo de archivo no permitido. Tipos permitidos: ${allowedTypes.join(', ')}` 
      };
    }
    
    // Verificar tamaño (10MB máximo)
    if (file.size > 10 * 1024 * 1024) {
      return { valid: false, error: 'El archivo excede el tamaño máximo de 10MB' };
    }
    
    return { valid: true };
  }

  /**
   * Ejemplo: Obtener estadísticas de documentos de entrenadores
   */
  async getTrainerDocumentsStats(): Promise<DocumentsStats> {
    const mainFolder = 'Entrenadores';
    const trainers = await this.firebaseStorage.listFiles(mainFolder);
    
    const stats: DocumentsStats = {
      totalTrainers: 0,
      totalDocuments: 0,
      totalSize: 0,
      trainersWithDocuments: []
    };
    
    for (const trainerFolder of trainers) {
      if (trainerFolder.includes('/')) {
        const trainerId = trainerFolder.split('/')[1];
        const trainerFiles = await this.firebaseStorage.listFiles(trainerFolder);
        
        if (trainerFiles.length > 0) {
          let trainerSize = 0;
          for (const file of trainerFiles) {
            const metadata = await this.firebaseStorage.getFileMetadata(file);
            if (metadata) {
              trainerSize += metadata.size;
            }
          }
          
          stats.trainersWithDocuments.push({
            trainerId,
            documentCount: trainerFiles.length,
            totalSize: trainerSize
          });
          
          stats.totalDocuments += trainerFiles.length;
          stats.totalSize += trainerSize;
        }
      }
    }
    
    stats.totalTrainers = stats.trainersWithDocuments.length;
    
    return stats;
  }
}
