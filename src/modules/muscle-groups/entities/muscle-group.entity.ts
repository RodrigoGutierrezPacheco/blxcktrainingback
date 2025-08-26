import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('muscle_groups')
export class MuscleGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, comment: 'Título del grupo muscular' })
  title: string;

  @Column({ type: 'text', comment: 'Descripción del grupo muscular' })
  description: string;

  @Column({ 
    type: 'boolean', 
    default: true, 
    comment: 'Indica si el grupo muscular está activo (soft delete)' 
  })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
