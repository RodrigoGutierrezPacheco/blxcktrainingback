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
import { Routine } from './routine.entity';

@Entity('user_routine_progress')
export class UserRoutineProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid', nullable: false })
  user_id: string;

  @ManyToOne(() => Routine, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'routine_id' })
  routine: Routine;

  @Column({ type: 'uuid', nullable: false })
  routine_id: string;

  @Column({ type: 'boolean', default: false, comment: 'Indica si la rutina completa fue completada' })
  isCompleted: boolean;

  @Column({ type: 'timestamp', nullable: true, comment: 'Fecha y hora cuando se completó la rutina' })
  completedAt: Date | null;

  @Column({ type: 'text', nullable: true, comment: 'Notas del usuario sobre la rutina completa' })
  notes: string | null;

  @Column({ type: 'integer', default: 0, comment: 'Número de semanas completadas' })
  completedWeeks: number;

  @Column({ type: 'integer', default: 0, comment: 'Número de días completados en total' })
  completedDays: number;

  @Column({ type: 'integer', default: 0, comment: 'Número de ejercicios completados en total' })
  completedExercises: number;

  @Column({ type: 'integer', nullable: true, comment: 'Total de minutos entrenados en la rutina' })
  totalMinutes: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
