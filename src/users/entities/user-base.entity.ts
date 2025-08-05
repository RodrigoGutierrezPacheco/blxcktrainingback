import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class UserBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'varchar', length: 20 })
  userType: string; 
}