import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Day } from './day.entity';

@Entity('exercises')
export class Exercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'int', nullable: false })
  sets: number;

  @Column({ type: 'int', nullable: false })
  repetitions: number;

  @Column({ type: 'int', nullable: false, comment: 'Rest time between sets in seconds' })
  restBetweenSets: number;

  @Column({ type: 'int', nullable: false, comment: 'Rest time between exercises in seconds' })
  restBetweenExercises: number;

  @Column({ type: 'text', nullable: true })
  comments: string;

  @Column({ type: 'int', nullable: false, default: 1 })
  order: number;

  @ManyToOne(() => Day, (day) => day.exercises, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'day_id' })
  day: Day;

  @Column({ type: 'uuid', nullable: false })
  day_id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
