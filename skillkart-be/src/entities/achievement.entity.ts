import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('achievements')
export class Achievement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column()
  xpReward: number;

  @Column()
  criteria: string; // JSON string: {"type": "xp_milestone", "value": 1000}

  @Column({ default: 'award' })
  iconType: string;

  @OneToMany('UserAchievement', 'achievement')
  userAchievements: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 