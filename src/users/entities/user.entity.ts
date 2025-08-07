import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  BeforeInsert, 
  CreateDateColumn, 
  UpdateDateColumn 
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid') // Cambiado a UUID
  id: string; // Cambiado de number a string

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

  @CreateDateColumn() // Nuevo campo automático
  createdAt: Date;

  @UpdateDateColumn() // Nuevo campo automático
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
    if (!this.id) {
      this.id = uuidv4(); // Generar UUID si no existe
    }
  }
}