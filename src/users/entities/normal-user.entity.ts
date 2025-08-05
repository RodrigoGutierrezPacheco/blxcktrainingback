import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { UserBase } from './user-base.entity';

@Entity()
export class NormalUser {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserBase)
  @JoinColumn()
  baseUser: UserBase;

  @Column({ type: 'text' })
  routine: string;

  @Column({ type: 'json', nullable: true })
  basicInfo: Record<string, any>;
}