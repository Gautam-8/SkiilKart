import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('user_badges')
export class UserBadge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  badgeId: number;

  @ManyToOne('User', 'userBadges')
  @JoinColumn({ name: 'userId' })
  user: any;

  @ManyToOne('Badge', 'userBadges')
  @JoinColumn({ name: 'badgeId' })
  badge: any;

  @CreateDateColumn()
  createdAt: Date;
} 