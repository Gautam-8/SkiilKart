import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('xp_logs')
export class XPLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  action: string;

  @Column()
  points: number;

  @ManyToOne('User', 'xpLogs')
  @JoinColumn({ name: 'userId' })
  user: any;

  @CreateDateColumn()
  createdAt: Date;
} 