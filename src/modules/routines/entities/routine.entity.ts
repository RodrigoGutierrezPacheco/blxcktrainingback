import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Week } from './week.entity';
import { UserRoutine } from './user-routine.entity';
import { Trainer } from '../../../users/entities/trainer.entity';

@Entity('routines')
export class Routine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  comments: string;

  @Column({ type: 'int', default: 1 })
  totalWeeks: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ManyToOne(() => Trainer, { nullable: false })
  @JoinColumn({ name: 'trainer_id' })
  trainer: Trainer;

  @Column({ type: 'uuid', nullable: false })
  trainer_id: string;

  @OneToMany(() => Week, (week) => week.routine, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  weeks: Week[];

  @OneToMany(() => UserRoutine, (userRoutine) => userRoutine.routine)
  userRoutines: UserRoutine[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
