import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity('roadmap_steps')
export class RoadmapStep {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roadmapId: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  type: string;

  @Column({ nullable: true })
  estimatedHours: number;

  @Column({ nullable: true })
  learningObjectives: string;

  @ManyToOne('Roadmap', 'steps')
  @JoinColumn({ name: 'roadmapId' })
  roadmap: any;

  @OneToMany('Resource', 'step')
  resources: any[];

  @OneToMany('UserRoadmapProgress', 'step')
  userProgress: any[];

  @OneToMany('Thread', 'step')
  threads: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 