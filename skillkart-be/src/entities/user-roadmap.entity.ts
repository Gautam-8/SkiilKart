import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity('user_roadmaps')
export class UserRoadmap {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  roadmapId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  startedAt: Date;

  @ManyToOne('User', 'userRoadmaps')
  @JoinColumn({ name: 'userId' })
  user: any;

  @ManyToOne('Roadmap', 'userRoadmaps')
  @JoinColumn({ name: 'roadmapId' })
  roadmap: any;

  @OneToMany('UserRoadmapProgress', 'userRoadmap')
  progress: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 