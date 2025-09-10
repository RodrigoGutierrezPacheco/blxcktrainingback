import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('media_assets')
export class MediaAsset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  folder: string; // e.g., Pecho, Espalda

  @Index({ unique: true })
  @Column({ type: 'text' })
  filePath: string; // e.g., Ejercicios/Pecho/press-banca.gif

  @Column({ type: 'text' })
  url: string;

  @Column({ type: 'varchar', length: 255 })
  name: string; // display name

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'boolean', default: false, comment: 'Indica si la imagen está asignada a algún ejercicio' })
  isAssigned: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}




