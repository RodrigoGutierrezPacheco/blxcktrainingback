import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrainerEducationDocument, EducationDocumentStatus } from './entities/trainer-education-document.entity';
import { UploadEducationDocumentDto } from './dto/upload-education-document.dto';
import { UpdateEducationDocumentDto } from './dto/update-education-document.dto';
import { VerifyEducationDocumentDto } from './dto/verify-education-document.dto';
import { Trainer } from 'src/users/entities/trainer.entity';
import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TrainerEducationService {
  constructor(
    @InjectRepository(TrainerEducationDocument)
    private educationDocumentRepository: Repository<TrainerEducationDocument>,
    
    @InjectRepository(Trainer)
    private trainerRepository: Repository<Trainer>,
  ) {}

  /**
   * Subir un nuevo documento de educación
   */
  async uploadDocument(
    trainerId: string, 
    file: Express.Multer.File, 
    uploadDto: UploadEducationDocumentDto
  ): Promise<TrainerEducationDocument> {
    // Verificar que el entrenador existe
    const trainer = await this.trainerRepository.findOne({
      where: { id: trainerId }
    });

    if (!trainer) {
      throw new NotFoundException('Entrenador no encontrado');
    }

    // Generar nombre único para el archivo
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${uuidv4()}_${uploadDto.title.replace(/\s+/g, '_').toLowerCase()}.${fileExtension}`;
    const filePath = `Entrenadores/${trainerId}/educacion/${fileName}`;

    try {
      // Subir archivo a Firebase Storage
      const bucket = admin.storage().bucket();
      const fileBuffer = file.buffer;
      
      await bucket.file(filePath).save(fileBuffer, {
        metadata: {
          contentType: file.mimetype,
        },
      });

      // Generar URL pública
      const [url] = await bucket.file(filePath).getSignedUrl({
        action: 'read',
        expires: '01-01-2100', // URL permanente
      });

      // Crear registro en la base de datos
      const document = this.educationDocumentRepository.create({
        title: uploadDto.title,
        description: uploadDto.description,
        originalName: file.originalname,
        fileName: fileName,
        filePath: filePath,
        mimeType: file.mimetype,
        fileSize: file.size,
        trainerId: trainerId,
        verificationStatus: EducationDocumentStatus.PENDIENTE,
        firebaseUrl: url,
      });

      return await this.educationDocumentRepository.save(document);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al subir el archivo';
      throw new BadRequestException(`Error al subir el archivo: ${errorMessage}`);
    }
  }

  /**
   * Obtener todos los documentos de educación de un entrenador
   */
  async getTrainerDocuments(trainerId: string): Promise<TrainerEducationDocument[]> {
    // Verificar que el entrenador existe
    const trainer = await this.trainerRepository.findOne({
      where: { id: trainerId }
    });

    if (!trainer) {
      throw new NotFoundException('Entrenador no encontrado');
    }

    return await this.educationDocumentRepository.find({
      where: { trainerId },
      order: { createdAt: 'DESC' }
    });
  }

  /**
   * Obtener un documento específico por ID
   */
  async getDocumentById(documentId: string): Promise<TrainerEducationDocument> {
    const document = await this.educationDocumentRepository.findOne({
      where: { id: documentId },
      relations: ['trainer']
    });

    if (!document) {
      throw new NotFoundException('Documento no encontrado');
    }

    return document;
  }

  /**
   * Actualizar información de un documento
   */
  async updateDocument(
    documentId: string, 
    updateDto: UpdateEducationDocumentDto
  ): Promise<TrainerEducationDocument> {
    const document = await this.educationDocumentRepository.findOne({
      where: { id: documentId }
    });

    if (!document) {
      throw new NotFoundException('Documento no encontrado');
    }

    // Solo permitir actualización si el documento no está verificado
    if (document.verificationStatus === EducationDocumentStatus.VERIFICADO) {
      throw new BadRequestException('No se puede editar un documento ya verificado');
    }

    // Aplicar actualizaciones
    if (updateDto.title) {
      document.title = updateDto.title;
    }

    if (updateDto.description) {
      document.description = updateDto.description;
    }

    // Resetear estado de verificación a pendiente si se modifica
    if (updateDto.title || updateDto.description) {
      document.verificationStatus = EducationDocumentStatus.PENDIENTE;
      document.verificationNotes = undefined;
      document.verifiedBy = undefined;
      document.verifiedAt = undefined;
    }

    return await this.educationDocumentRepository.save(document);
  }

  /**
   * Eliminar un documento
   */
  async deleteDocument(documentId: string): Promise<void> {
    const document = await this.educationDocumentRepository.findOne({
      where: { id: documentId }
    });

    if (!document) {
      throw new NotFoundException('Documento no encontrado');
    }

    try {
      // Eliminar archivo de Firebase Storage
      const bucket = admin.storage().bucket();
      await bucket.file(document.filePath).delete();

      // Eliminar registro de la base de datos
      await this.educationDocumentRepository.remove(document);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al eliminar el documento';
      throw new BadRequestException(`Error al eliminar el documento: ${errorMessage}`);
    }
  }

  /**
   * Verificar un documento (solo admin)
   */
  async verifyDocument(
    documentId: string, 
    verifyDto: VerifyEducationDocumentDto, 
    adminId: string
  ): Promise<TrainerEducationDocument> {
    const document = await this.educationDocumentRepository.findOne({
      where: { id: documentId }
    });

    if (!document) {
      throw new NotFoundException('Documento no encontrado');
    }

    // Actualizar estado de verificación
    document.verificationStatus = verifyDto.verificationStatus;
    document.verificationNotes = verifyDto.verificationNotes;
    document.verifiedBy = adminId;
    document.verifiedAt = new Date();

    return await this.educationDocumentRepository.save(document);
  }

  /**
   * Obtener documentos por estado de verificación
   */
  async getDocumentsByStatus(status: EducationDocumentStatus): Promise<TrainerEducationDocument[]> {
    return await this.educationDocumentRepository.find({
      where: { verificationStatus: status },
      relations: ['trainer'],
      order: { createdAt: 'DESC' }
    });
  }

  /**
   * Obtener todos los documentos pendientes
   */
  async getPendingDocuments(): Promise<TrainerEducationDocument[]> {
    return await this.getDocumentsByStatus(EducationDocumentStatus.PENDIENTE);
  }

  /**
   * Obtener todos los documentos verificados
   */
  async getVerifiedDocuments(): Promise<TrainerEducationDocument[]> {
    return await this.getDocumentsByStatus(EducationDocumentStatus.VERIFICADO);
  }

  /**
   * Obtener todos los documentos rechazados
   */
  async getRejectedDocuments(): Promise<TrainerEducationDocument[]> {
    return await this.getDocumentsByStatus(EducationDocumentStatus.RECHAZADO);
  }

  /**
   * Obtener estadísticas de documentos por entrenador
   */
  async getTrainerDocumentStats(trainerId: string): Promise<{
    total: number;
    pending: number;
    verified: number;
    rejected: number;
  }> {
    const [total, pending, verified, rejected] = await Promise.all([
      this.educationDocumentRepository.count({ where: { trainerId } }),
      this.educationDocumentRepository.count({ 
        where: { trainerId, verificationStatus: EducationDocumentStatus.PENDIENTE } 
      }),
      this.educationDocumentRepository.count({ 
        where: { trainerId, verificationStatus: EducationDocumentStatus.VERIFICADO } 
      }),
      this.educationDocumentRepository.count({ 
        where: { trainerId, verificationStatus: EducationDocumentStatus.RECHAZADO } 
      }),
    ]);

    return { total, pending, verified, rejected };
  }

  /**
   * Obtener URL firmada para descargar un documento
   */
  async getDocumentSignedUrl(documentId: string, expirationMinutes: number = 60): Promise<string> {
    const document = await this.educationDocumentRepository.findOne({
      where: { id: documentId }
    });

    if (!document) {
      throw new NotFoundException('Documento no encontrado');
    }

    try {
      const bucket = admin.storage().bucket();
      const [url] = await bucket.file(document.filePath).getSignedUrl({
        action: 'read',
        expires: Date.now() + (expirationMinutes * 60 * 1000),
      });

      return url;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al generar URL firmada';
      throw new BadRequestException(`Error al generar URL firmada: ${errorMessage}`);
    }
  }
}
