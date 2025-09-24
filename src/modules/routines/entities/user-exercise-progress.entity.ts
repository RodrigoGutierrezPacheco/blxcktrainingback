import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../../users/entities/user.entity';
import { Exercise } from './exercise.entity';

@Entity('user_exercise_progress')
export class UserExerciseProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid', nullable: false })
  user_id: string;

  @ManyToOne(() => Exercise, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'exercise_id' })
  exercise: Exercise;

  @Column({ type: 'uuid', nullable: false })
  exercise_id: string;

  @Column({ type: 'boolean', default: false, comment: 'Indica si el ejercicio fue completado' })
  isCompleted: boolean;

  @Column({ type: 'timestamp', nullable: true, comment: 'Fecha y hora cuando se completó el ejercicio' })
  completedAt: Date | null;

  @Column({ type: 'json', nullable: true, comment: 'Información adicional del progreso (series realizadas, peso usado, etc.)' })
  progressData: Record<string, any> | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
