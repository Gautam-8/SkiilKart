import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity('threads')
export class Thread {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roadmapId: number;

  @Column({ nullable: true })
  stepId: number;

  @Column()
  title: string;

  @Column()
  userId: number;

  @ManyToOne('User', 'threads')
  @JoinColumn({ name: 'userId' })
  user: any;

  @ManyToOne('Roadmap', 'threads')
  @JoinColumn({ name: 'roadmapId' })
  roadmap: any;

  @ManyToOne('RoadmapStep', 'threads', { nullable: true })
  @JoinColumn({ name: 'stepId' })
  step: any;

  @OneToMany('Comment', 'thread')
  comments: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 