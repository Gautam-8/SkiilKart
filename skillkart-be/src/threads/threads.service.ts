import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Thread } from '../entities/thread.entity';
import { Comment } from '../entities/comment.entity';
import { Roadmap } from '../entities/roadmap.entity';
import { RoadmapStep } from '../entities/roadmap-step.entity';
import { User, UserRole } from '../entities/user.entity';
import { CreateThreadDto } from './dto/create-thread.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class ThreadsService {
  constructor(
    @InjectRepository(Thread)
    private threadRepository: Repository<Thread>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Roadmap)
    private roadmapRepository: Repository<Roadmap>,
    @InjectRepository(RoadmapStep)
    private roadmapStepRepository: Repository<RoadmapStep>,
  ) {}

  // POST /threads (Learners only)
  async createThread(createThreadDto: CreateThreadDto, user: User) {
    // Only learners can create threads
    if (user.role !== UserRole.LEARNER) {
      throw new ForbiddenException('Only learners can create discussion threads');
    }

    const { roadmapId, stepId } = createThreadDto;

    // Verify roadmap exists
    const roadmap = await this.roadmapRepository.findOne({
      where: { id: roadmapId },
    });

    if (!roadmap) {
      throw new NotFoundException('Roadmap not found');
    }

    // Verify step exists if provided
    if (stepId) {
      const step = await this.roadmapStepRepository.findOne({
        where: { id: stepId, roadmapId },
      });

      if (!step) {
        throw new NotFoundException('Roadmap step not found');
      }
    }

    // Create thread
    const thread = this.threadRepository.create({
      ...createThreadDto,
      userId: user.id,
    });

    await this.threadRepository.save(thread);

    return thread;
  }

  // GET /threads/roadmap/:roadmapId
  async getThreadsByRoadmap(roadmapId: number) {
    // Verify roadmap exists
    const roadmap = await this.roadmapRepository.findOne({
      where: { id: roadmapId },
    });

    if (!roadmap) {
      throw new NotFoundException('Roadmap not found');
    }

    const threads = await this.threadRepository.find({
      where: { roadmapId },
      order: { createdAt: 'DESC' },
    });

    return threads;
  }

  // POST /comments (Learners only)
  async createComment(threadId: number, createCommentDto: CreateCommentDto, user: User) {
    // Only learners can create comments
    if (user.role !== UserRole.LEARNER) {
      throw new ForbiddenException('Only learners can create comments');
    }

    // Verify thread exists
    const thread = await this.threadRepository.findOne({
      where: { id: threadId },
    });

    if (!thread) {
      throw new NotFoundException('Thread not found');
    }

    // Create comment
    const comment = this.commentRepository.create({
      threadId,
      userId: user.id,
      content: createCommentDto.content,
    });

    await this.commentRepository.save(comment);

    return comment;
  }

  // GET /comments/thread/:threadId
  async getCommentsByThread(threadId: number) {
    // Verify thread exists
    const thread = await this.threadRepository.findOne({
      where: { id: threadId },
    });

    if (!thread) {
      throw new NotFoundException('Thread not found');
    }

    const comments = await this.commentRepository.find({
      where: { threadId },
      order: { createdAt: 'ASC' },
    });

    return comments;
  }
} 