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
import { Routine } from './routine.entity';
import { Day } from './day.entity';

@Entity('weeks')
export class Week {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', nullable: false })
  weekNumber: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  comments: string;

  @ManyToOne(() => Routine, (routine) => routine.weeks, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'routine_id' })
  routine: Routine;

  @Column({ type: 'uuid', nullable: false })
  routine_id: string;

  @OneToMany(() => Day, (day) => day.week, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  days: Day[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
