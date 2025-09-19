import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { UserBase } from './user-base.entity';
import { UserTrainer } from './user-trainer.entity';

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

  @Column({ type: 'varchar', length: 20, nullable: true, comment: 'Número telefónico del usuario' })
  phone?: string;

  @Column({ type: 'uuid', nullable: true })
  trainerId: string | null;

  @OneToMany(() => UserTrainer, userTrainer => userTrainer.user)
  trainerAssignments: UserTrainer[];
}