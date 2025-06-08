import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('roadmaps')
export class Roadmap {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  difficulty: string;

  @Column('text', { array: true, nullable: true })
  skills: string[];

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