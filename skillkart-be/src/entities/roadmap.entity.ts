import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('roadmaps')
export class Roadmap {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  skillCategory: string;

  @Column()
  description: string;

  @Column()
  totalWeeks: number;

  @OneToMany('RoadmapStep', 'roadmap')
  steps: any[];

  @OneToMany('UserRoadmap', 'roadmap')
  userRoadmaps: any[];

  @OneToMany('Thread', 'roadmap')
  threads: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 