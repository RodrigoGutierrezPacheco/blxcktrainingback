import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrainerVerificationDocument, DocumentType, VerificationStatus } from './entities/trainer-verification-document.entity';
import { Trainer } from 'src/users/entities/trainer.entity';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { VerifyDocumentDto } from './dto/verify-document.dto';
import { ReplaceDocumentDto } from './dto/replace-document.dto';
import { FirebaseStorageService } from 'src/common/firebase';
import { v4 as uuidv4 } from 'uuid';
import { Not, IsNull } from 'typeorm';

@Injectable()
export class TrainerVerificationService {
  private readonly firebaseFolder = 'Entrenadores';

  constructor(
    @InjectRepository(TrainerVerificationDocument)
    private documentRepository: Repository<TrainerVerificationDocument>,
    @InjectRepository(Trainer)
    private trainerRepository: Repository<Trainer>,
    private readonly firebaseStorage: FirebaseStorageService,
  ) {}

  async uploadDocument(
    trainerId: string,
    file: Express.Multer.File,
    uploadDto: UploadDocumentDto,
  ): Promise<TrainerVerificationDocument> {
    // Verificar que el entrenador existe
    const trainer = await this.trainerRepository.findOne({ where: { id: trainerId } });
    if (!trainer) {
      throw new NotFoundException('Entrenador no encontrado');
    }

    // Verificar que no existe ya un documento del mismo tipo para este entrenador
    const existingDocument = await this.documentRepository.findOne({
      where: { trainerId, documentType: uploadDto.documentType }
    });

    if (existingDocument) {
      throw new BadRequestException(`Ya existe un documento de tipo ${uploadDto.documentType} para este entrenador`);
    }

    // Generar nombre único para el archivo
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${trainerId}_${uploadDto.documentType}_${uuidv4()}.${fileExtension}`;
    const firebasePath = `${this.firebaseFolder}/${trainerId}/${fileName}`;

    // Subir archivo a Firebase Storage
    const uploadResult = await this.firebaseStorage.uploadFile(file, firebasePath);

    if (!uploadResult.success) {
      throw new BadRequestException(`Error al subir el archivo: ${uploadResult.error}`);
    }

    // Crear registro en la base de datos
    const document = this.documentRepository.create({
      documentType: uploadDto.documentType,
      originalName: file.originalname,
      fileName,
      filePath: firebasePath, // Guardamos la ruta de Firebase
      mimeType: file.mimetype,
      fileSize: file.size,
      trainerId,
      firebaseUrl: uploadResult.url, // Guardamos la URL de Firebase
    });

    return await this.documentRepository.save(document);
  }

  async replaceDocument(
    trainerId: string,
    documentType: DocumentType,
    file: Express.Multer.File,
    replaceDto: ReplaceDocumentDto,
  ): Promise<TrainerVerificationDocument> {
    // Verificar que el entrenador existe
    const trainer = await this.trainerRepository.findOne({ where: { id: trainerId } });
    if (!trainer) {
      throw new NotFoundException('Entrenador no encontrado');
    }

    // Buscar documento existente
    const existingDocument = await this.documentRepository.findOne({
      where: { trainerId, documentType }
    });

    if (!existingDocument) {
      throw new NotFoundException(`No existe un documento de tipo ${documentType} para este entrenador`);
    }

    // Eliminar archivo anterior de Firebase Storage
    if (existingDocument.filePath) {
      await this.firebaseStorage.deleteFile(existingDocument.filePath);
    }

    // Generar nuevo nombre de archivo
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${trainerId}_${documentType}_${uuidv4()}.${fileExtension}`;
    const firebasePath = `${this.firebaseFolder}/${trainerId}/${fileName}`;

    // Subir nuevo archivo a Firebase Storage
    const uploadResult = await this.firebaseStorage.uploadFile(file, firebasePath);

    if (!uploadResult.success) {
      throw new BadRequestException(`Error al subir el archivo: ${uploadResult.error}`);
    }

    // Actualizar registro en la base de datos
    existingDocument.originalName = file.originalname;
    existingDocument.fileName = fileName;
    existingDocument.filePath = firebasePath;
    existingDocument.mimeType = file.mimetype;
    existingDocument.fileSize = file.size;
    existingDocument.verificationStatus = VerificationStatus.PENDIENTE; // Resetear verificación
    existingDocument.verificationNotes = undefined;
    existingDocument.verifiedBy = undefined;
    existingDocument.verifiedAt = undefined;
    existingDocument.firebaseUrl = uploadResult.url;

    return await this.documentRepository.save(existingDocument);
  }

  async getDocuments(trainerId: string): Promise<TrainerVerificationDocument[]> {
    // Verificar que el entrenador existe
    const trainer = await this.trainerRepository.findOne({ where: { id: trainerId } });
    if (!trainer) {
      throw new NotFoundException('Entrenador no encontrado');
    }

    return await this.documentRepository.find({
      where: { trainerId },
      order: { createdAt: 'DESC' }
    });
  }

  async getDocument(documentId: string, trainerId: string): Promise<TrainerVerificationDocument> {
    const document = await this.documentRepository.findOne({
      where: { id: documentId, trainerId }
    });

    if (!document) {
      throw new NotFoundException('Documento no encontrado');
    }

    return document;
  }

  async deleteDocument(documentId: string, trainerId: string): Promise<void> {
    const document = await this.documentRepository.findOne({
      where: { id: documentId, trainerId }
    });

    if (!document) {
      throw new NotFoundException('Documento no encontrado');
    }

    // Eliminar archivo de Firebase Storage
    if (document.filePath) {
      await this.firebaseStorage.deleteFile(document.filePath);
    }

    // Eliminar registro de la base de datos
    await this.documentRepository.remove(document);
  }

  async verifyDocument(
    documentId: string,
    verifyDto: VerifyDocumentDto,
    adminId: string,
  ): Promise<TrainerVerificationDocument> {
    const document = await this.documentRepository.findOne({
      where: { id: documentId },
      relations: ['trainer']
    });

    if (!document) {
      throw new NotFoundException('Documento no encontrado');
    }

    // Actualizar estado de verificación
    document.verificationStatus = verifyDto.verificationStatus;
    document.verificationNotes = verifyDto.verificationNotes;
    document.verifiedBy = adminId;
    document.verifiedAt = new Date();

    // Si el documento es aceptado, verificar si todos los documentos del entrenador están aceptados
    if (verifyDto.verificationStatus === VerificationStatus.ACEPTADA) {
      const allDocuments = await this.documentRepository.find({
        where: { trainerId: document.trainerId }
      });

      const allAccepted = allDocuments.every(doc => doc.verificationStatus === VerificationStatus.ACEPTADA);
      
      if (allAccepted) {
        // Actualizar estado de verificación del entrenador
        await this.trainerRepository.update(
          { id: document.trainerId },
          { isVerified: true }
        );
      }
    }

    return await this.documentRepository.save(document);
  }

  async getAllPendingDocuments(): Promise<TrainerVerificationDocument[]> {
    return await this.documentRepository.find({
      where: { verificationStatus: VerificationStatus.PENDIENTE },
      relations: ['trainer'],
      order: { createdAt: 'ASC' }
    });
  }

  // Obtener documentos verificados
  async getVerifiedDocuments(): Promise<TrainerVerificationDocument[]> {
    return await this.documentRepository.find({
      where: { verificationStatus: VerificationStatus.ACEPTADA },
      relations: ['trainer'],
      order: { verifiedAt: 'DESC' }
    });
  }

  // Obtener documentos rechazados
  async getRejectedDocuments(): Promise<TrainerVerificationDocument[]> {
    return await this.documentRepository.find({
      where: { verificationStatus: VerificationStatus.RECHAZADA, verificationNotes: Not(IsNull()) },
      relations: ['trainer'],
      order: { updatedAt: 'DESC' }
    });
  }

  async getDocumentFile(documentId: string, trainerId: string): Promise<{ 
    filePath: string; 
    fileName: string; 
    mimeType: string;
    firebaseUrl?: string;
    signedUrl?: string;
  }> {
    const document = await this.documentRepository.findOne({
      where: { id: documentId, trainerId }
    });

    if (!document) {
      throw new NotFoundException('Documento no encontrado');
    }

    // Generar URL firmada para acceso temporal (1 hora)
    const signedUrl = await this.firebaseStorage.getSignedUrl(document.filePath, 60);

    return {
      filePath: document.filePath,
      fileName: document.originalName,
      mimeType: document.mimeType,
      firebaseUrl: document.firebaseUrl,
      signedUrl: signedUrl || undefined
    };
  }

  // Método para obtener URL firmada de un documento
  async getDocumentSignedUrl(documentId: string, trainerId: string, expirationMinutes: number = 60): Promise<string | null> {
    const document = await this.documentRepository.findOne({
      where: { id: documentId, trainerId }
    });

    if (!document) {
      throw new NotFoundException('Documento no encontrado');
    }

    return await this.firebaseStorage.getSignedUrl(document.filePath, expirationMinutes);
  }

  // Método para listar archivos de un entrenador en Firebase
  async listTrainerFiles(trainerId: string): Promise<string[]> {
    const folderPath = `${this.firebaseFolder}/${trainerId}`;
    return await this.firebaseStorage.listFiles(folderPath);
  }

  // Método para verificar si un archivo existe en Firebase
  async fileExistsInFirebase(filePath: string): Promise<boolean> {
    return await this.firebaseStorage.fileExists(filePath);
  }
}
