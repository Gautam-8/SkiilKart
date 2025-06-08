import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

export enum UserRole {
  LEARNER = 'Learner',
  ADMIN = 'Admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.LEARNER,
  })
  role: UserRole;

  @Column('text', { array: true, nullable: true })
  interests: string[];

  @Column({ nullable: true })
  goal: string;

  @Column({ nullable: true })
  availableWeeklyHours: number;

  @OneToMany('UserRoadmap', 'user')
  userRoadmaps: any[];

  @OneToMany('Thread', 'user')
  threads: any[];

  @OneToMany('Comment', 'user')
  comments: any[];

  @OneToMany('XPLog', 'user')
  xpLogs: any[];

  @OneToMany('UserBadge', 'user')
  userBadges: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 