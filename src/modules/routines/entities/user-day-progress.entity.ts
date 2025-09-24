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
import { Day } from './day.entity';

@Entity('user_day_progress')
export class UserDayProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid', nullable: false })
  user_id: string;

  @ManyToOne(() => Day, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'day_id' })
  day: Day;

  @Column({ type: 'uuid', nullable: false })
  day_id: string;

  @Column({ type: 'boolean', default: false, comment: 'Indica si el día fue completado' })
  isCompleted: boolean;

  @Column({ type: 'timestamp', nullable: true, comment: 'Fecha y hora cuando se completó el día' })
  completedAt: Date | null;

  @Column({ type: 'text', nullable: true, comment: 'Notas del usuario sobre el día de entrenamiento' })
  notes: string | null;

  @Column({ type: 'integer', nullable: true, comment: 'Duración del entrenamiento en minutos' })
  durationMinutes: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
