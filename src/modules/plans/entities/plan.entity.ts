import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('plans')
export class Plan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  duration: string;

  @Column({ 
    type: 'enum', 
    enum: ['user', 'trainer'], 
    nullable: true,
    comment: 'Tipo de plan: user (usuario) o trainer (entrenador)'
  })
  type: 'user' | 'trainer' | null;

  @Column({ type: 'text', nullable: true })
  detail: string;

  @Column({ type: 'json', nullable: false, default: '[]' })
  features: string[];

  @Column({ 
    type: 'json', 
    nullable: true,
    comment: 'Badge del plan con color y nombre'
  })
  badge: {
    color: string;
    name: string;
  } | null;

  @Column({ 
    type: 'json', 
    nullable: true,
    comment: 'Imagen del plan con tipo y URL'
  })
  image: {
    type: string;
    url: string;
  } | null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
