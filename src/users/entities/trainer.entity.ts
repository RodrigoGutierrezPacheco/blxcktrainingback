import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

@Entity()
export class Trainer {
  @PrimaryGeneratedColumn("uuid") // Cambiado a UUID
  id: string; // Cambiado de number a string

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

  @CreateDateColumn() // Nuevo campo automático
  createdAt: Date;

  @UpdateDateColumn() // Nuevo campo automático
  updatedAt: Date;

  @BeforeInsert()
  async beforeInsertActions() {
    if (!this.id) {
      this.id = uuidv4(); // Generar UUID si no existe
    }
    this.password = await bcrypt.hash(this.password, 10); // Hash de la contraseña
  }
}
