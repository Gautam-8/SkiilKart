import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

export enum ResourceType {
  VIDEO = 'Video',
  BLOG = 'Blog',
  QUIZ = 'Quiz',
}

@Entity('resources')
export class Resource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  stepId: number;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: ResourceType,
  })
  type: ResourceType;

  @Column()
  url: string;

  @ManyToOne('RoadmapStep', 'resources')
  @JoinColumn({ name: 'stepId' })
  step: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 