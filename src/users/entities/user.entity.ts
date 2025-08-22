import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { UserTrainer } from './user-trainer.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  role: string;

  // Campos adicionales que se completarán después
  @Column({ nullable: true })
  age?: number;

  @Column({ nullable: true })
  weight?: number;

  @Column({ nullable: true })
  height?: number;

  @Column({ type: 'text', nullable: true })
  chronicDiseases?: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth?: Date;

  @Column({ type: 'text', nullable: true })
  healthIssues?: string;

  @Column({ type: 'uuid', nullable: true })
  trainerId: string | null;

  @Column({ type: 'boolean', default: false, comment: 'Indica si el usuario tiene rutina asignada' })
  hasRoutine: boolean;

  @Column({ type: 'boolean', default: true, comment: 'Indica si el usuario está activo (soft delete)' })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UserTrainer, userTrainer => userTrainer.user)
  trainerAssignments: UserTrainer[];
}