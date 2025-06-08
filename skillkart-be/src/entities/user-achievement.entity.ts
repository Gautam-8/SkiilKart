import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('user_achievements')
export class UserAchievement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  achievementId: number;

  @ManyToOne('Achievement', 'userAchievements')
  @JoinColumn({ name: 'achievementId' })
  achievement: any;

  @CreateDateColumn()
  createdAt: Date;
} 