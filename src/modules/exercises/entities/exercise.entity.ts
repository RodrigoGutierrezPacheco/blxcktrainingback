import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MuscleGroup } from '../../muscle-groups/entities/muscle-group.entity';

@Entity('exercise_catalog')
export class Exercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, comment: 'Nombre del ejercicio' })
  name: string;

  @Column({ type: 'text', comment: 'Descripción del ejercicio' })
  description: string;

  @Column({ 
    type: 'json', 
    nullable: true, 
    comment: 'Imagen del ejercicio con tipo y URL' 
  })
  image: { type: string; url: string; } | null;

  @Column({ 
    type: 'uuid', 
    comment: 'ID del grupo muscular al que pertenece' 
  })
  muscleGroupId: string;

  @Column({ 
    type: 'varchar', 
    length: 100, 
    comment: 'Nombre del grupo muscular (para consultas rápidas)' 
  })
  muscleGroupName: string;

  @Column({ 
    type: 'boolean', 
    default: true, 
    comment: 'Indica si el ejercicio está activo (soft delete)' 
  })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => MuscleGroup, { nullable: false })
  @JoinColumn({ name: 'muscleGroupId' })
  muscleGroup: MuscleGroup;
}
