import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  BeforeInsert 
} from "typeorm";
import { v4 as uuidv4 } from 'uuid';

@Entity("admins") // Especifica el nombre de la tabla
export class Admin {
  @PrimaryGeneratedColumn('uuid') // Cambiado a UUID
  id: string; // Cambiado de number a string

  @Column({ length: 100 })
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: "admin" })
  role: string;

  @CreateDateColumn() // Nuevo campo automático
  createdAt: Date;

  @UpdateDateColumn() // Nuevo campo automático
  updatedAt: Date;

  @BeforeInsert()
  generateUuid() {
    if (!this.id) {
      this.id = uuidv4(); // Generar UUID si no existe
    }
  }
}