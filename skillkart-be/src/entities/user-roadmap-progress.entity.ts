import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

export enum ProgressStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS', 
  COMPLETED = 'COMPLETED',
}

@Entity('user_roadmap_progress')
export class UserRoadmapProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userRoadmapId: number;

  @Column()
  stepId: number;

  @Column({
    type: 'enum',
    enum: ProgressStatus,
    default: ProgressStatus.NOT_STARTED,
  })
  status: ProgressStatus;

  @ManyToOne('UserRoadmap', 'progress')
  @JoinColumn({ name: 'userRoadmapId' })
  userRoadmap: any;

  @ManyToOne('RoadmapStep', 'userProgress', { nullable: true })
  @JoinColumn({ name: 'stepId' })
  step: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 