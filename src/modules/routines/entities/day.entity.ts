import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Week } from './week.entity';
import { Exercise } from './exercise.entity';

@Entity('days')
export class Day {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', nullable: false })
  dayNumber: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  comments: string;

  @ManyToOne(() => Week, (week) => week.days, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'week_id' })
  week: Week;

  @Column({ type: 'uuid', nullable: false })
  week_id: string;

  @OneToMany(() => Exercise, (exercise) => exercise.day, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  exercises: Exercise[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
