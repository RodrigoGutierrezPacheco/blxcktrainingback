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
import { Week } from './week.entity';

@Entity('user_week_progress')
export class UserWeekProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid', nullable: false })
  user_id: string;

  @ManyToOne(() => Week, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'week_id' })
  week: Week;

  @Column({ type: 'uuid', nullable: false })
  week_id: string;

  @Column({ type: 'boolean', default: false, comment: 'Indica si la semana fue completada' })
  isCompleted: boolean;

  @Column({ type: 'timestamp', nullable: true, comment: 'Fecha y hora cuando se completó la semana' })
  completedAt: Date | null;

  @Column({ type: 'text', nullable: true, comment: 'Notas del usuario sobre la semana de entrenamiento' })
  notes: string | null;

  @Column({ type: 'integer', default: 0, comment: 'Número de días completados en esta semana' })
  completedDays: number;

  @Column({ type: 'integer', nullable: true, comment: 'Total de minutos entrenados en la semana' })
  totalMinutes: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
