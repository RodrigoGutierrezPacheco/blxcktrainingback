import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Trainer } from "src/users/entities/trainer.entity";

export enum DocumentType {
  IDENTIFICATION = "identification",
  BIRTH_CERTIFICATE = "birth_certificate",
  CURP = "curp",
  RFC = "rfc"
}

export enum VerificationStatus {
  PENDIENTE = "pendiente",
  RECHAZADA = "rechazada",
  ACEPTADA = "aceptada"
}

@Entity()
export class TrainerVerificationDocument {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "enum",
    enum: DocumentType,
    comment: "Tipo de documento de verificación"
  })
  documentType: DocumentType;

  @Column({ comment: "Nombre original del archivo" })
  originalName: string;

  @Column({ comment: "Nombre del archivo guardado en el servidor" })
  fileName: string;

  @Column({ comment: "Ruta completa del archivo en Firebase Storage" })
  filePath: string;

  @Column({ comment: "Tipo MIME del archivo" })
  mimeType: string;

  @Column({ comment: "Tamaño del archivo en bytes" })
  fileSize: number;

  @Column({ 
    type: "enum", 
    enum: VerificationStatus, 
    default: VerificationStatus.PENDIENTE,
    comment: "Estado de verificación del documento: pendiente, rechazada o aceptada'"
  })
  verificationStatus: VerificationStatus;

  @Column({ type: "text", nullable: true, comment: "Comentarios del admin sobre la verificación" })
  verificationNotes?: string;

  @Column({ type: "uuid", nullable: true, comment: "ID del admin que verificó el documento" })
  verifiedBy?: string;

  @Column({ type: "timestamp", nullable: true, comment: "Fecha de verificación" })
  verifiedAt?: Date;

  @Column({ type: "uuid", comment: "ID del entrenador al que pertenece el documento" })
  trainerId: string;

  @Column({ type: "text", nullable: true, comment: "URL pública del archivo en Firebase Storage" })
  firebaseUrl?: string;

  @ManyToOne(() => Trainer, trainer => trainer.id, { onDelete: "CASCADE" })
  @JoinColumn({ name: "trainerId" })
  trainer: Trainer;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
