import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("admins") // Especifica el nombre de la tabla
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: "admin" })
  role: string;
}
