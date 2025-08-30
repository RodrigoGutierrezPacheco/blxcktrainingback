import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Trainer } from "src/users/entities/trainer.entity";

export enum EducationDocumentStatus {
  PENDIENTE = "pendiente",
  VERIFICADO = "verificado",
  RECHAZADO = "rechazado"
}

@Entity()
export class TrainerEducationDocument {
  @ApiProperty({
    description: 'ID único del documento de educación',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({
    description: 'Título del documento de educación',
    example: 'Certificación en Entrenamiento Personal'
  })
  @Column({ length: 200, comment: "Título del documento de educación" })
  title: string;

  @ApiProperty({
    description: 'Descripción detallada del documento',
    example: 'Certificación obtenida en el Instituto Nacional de Deportes con especialización en entrenamiento funcional'
  })
  @Column({ type: "text", comment: "Descripción detallada del documento" })
  description: string;

  @ApiProperty({
    description: 'Nombre original del archivo',
    example: 'certificacion_entrenamiento_personal.pdf'
  })
  @Column({ comment: "Nombre original del archivo" })
  originalName: string;

  @ApiProperty({
    description: 'Nombre del archivo guardado en el servidor',
    example: '123e4567-e89b-12d3-a456-426614174000_certificacion.pdf'
  })
  @Column({ comment: "Nombre del archivo guardado en el servidor" })
  fileName: string;

  @ApiProperty({
    description: 'Ruta completa del archivo en Firebase Storage',
    example: 'Entrenadores/123e4567-e89b-12d3-a456-426614174000/educacion/certificacion.pdf'
  })
  @Column({ comment: "Ruta completa del archivo en Firebase Storage" })
  filePath: string;

  @ApiProperty({
    description: 'Tipo MIME del archivo',
    example: 'application/pdf'
  })
  @Column({ comment: "Tipo MIME del archivo" })
  mimeType: string;

  @ApiProperty({
    description: 'Tamaño del archivo en bytes',
    example: 2048576
  })
  @Column({ comment: "Tamaño del archivo en bytes" })
  fileSize: number;

  @ApiProperty({
    description: 'Estado de verificación del documento',
    enum: EducationDocumentStatus,
    example: EducationDocumentStatus.PENDIENTE,
    default: EducationDocumentStatus.PENDIENTE
  })
  @Column({ 
    type: "enum", 
    enum: EducationDocumentStatus, 
    default: EducationDocumentStatus.PENDIENTE,
    comment: "Estado de verificación del documento: pendiente, verificado o rechazado"
  })
  verificationStatus: EducationDocumentStatus;

  @ApiProperty({
    description: 'Comentarios del admin sobre la verificación',
    example: 'Documento verificado correctamente. Certificación válida y vigente.',
    required: false
  })
  @Column({ type: "text", nullable: true, comment: "Comentarios del admin sobre la verificación" })
  verificationNotes?: string;

  @ApiProperty({
    description: 'ID del admin que verificó el documento',
    example: '123e4567-e89b-12d3-a456-426614174001',
    required: false
  })
  @Column({ type: "uuid", nullable: true, comment: "ID del admin que verificó el documento" })
  verifiedBy?: string;

  @ApiProperty({
    description: 'Fecha de verificación',
    example: '2024-01-15T10:30:00.000Z',
    required: false
  })
  @Column({ type: "timestamp", nullable: true, comment: "Fecha de verificación" })
  verifiedAt?: Date;

  @ApiProperty({
    description: 'ID del entrenador al que pertenece el documento',
    example: '123e4567-e89b-12d3-a456-426614174002'
  })
  @Column({ type: "uuid", comment: "ID del entrenador al que pertenece el documento" })
  trainerId: string;

  @ApiProperty({
    description: 'URL pública del archivo en Firebase Storage',
    example: 'https://firebasestorage.googleapis.com/v0/b/project-id/o/Entrenadores%2F123e4567-e89b-12d3-a456-426614174002%2Feducacion%2Fcertificacion.pdf?alt=media',
    required: false
  })
  @Column({ type: "text", nullable: true, comment: "URL pública del archivo en Firebase Storage" })
  firebaseUrl?: string;

  @ApiProperty({
    description: 'Relación con el entrenador',
    type: () => Trainer
  })
  @ManyToOne(() => Trainer, trainer => trainer.id, { onDelete: "CASCADE" })
  @JoinColumn({ name: "trainerId" })
  trainer: Trainer;

  @ApiProperty({
    description: 'Fecha de creación del documento',
    example: '2024-01-10T09:00:00.000Z'
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización del documento',
    example: '2024-01-15T10:30:00.000Z'
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
