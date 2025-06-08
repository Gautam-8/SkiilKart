import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  threadId: number;

  @Column()
  userId: number;

  @Column('text')
  content: string;

  @ManyToOne('User', 'comments')
  @JoinColumn({ name: 'userId' })
  user: any;

  @ManyToOne('Thread', 'comments')
  @JoinColumn({ name: 'threadId' })
  thread: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 