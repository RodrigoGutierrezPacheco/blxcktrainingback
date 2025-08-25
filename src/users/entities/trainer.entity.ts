import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { UserTrainer } from "./user-trainer.entity";

@Entity()
export class Trainer {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 100 })
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: "trainer" })
  role: string;

  // Campos adicionales para entrenadores
  @Column({ nullable: true })
  age?: number;

  @Column({ nullable: true })
  phone?: string;

  @Column({ type: "text", nullable: true })
  documents?: string;

  @Column({ type: 'boolean', default: true, comment: 'Indica si el entrenador está activo' })
  isActive: boolean;

  @Column({ type: 'boolean', default: false, comment: 'Indica si el entrenador está verificado' })
  isVerified: boolean;

  @Column({ type: 'varchar', length: 13, nullable: true, comment: 'RFC del entrenador' })
  rfc?: string;

  @Column({ type: 'varchar', length: 18, nullable: true, comment: 'CURP del entrenador' })
  curp?: string;

  @Column({ type: 'date', nullable: true, comment: 'Fecha de nacimiento del entrenador' })
  dateOfBirth: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UserTrainer, userTrainer => userTrainer.trainer)
  userAssignments: UserTrainer[];
}
