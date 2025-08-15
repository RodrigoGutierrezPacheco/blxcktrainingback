import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
