import { Repository } from 'typeorm';
import { Thread } from '../entities/thread.entity';
import { Comment } from '../entities/comment.entity';
import { Roadmap } from '../entities/roadmap.entity';
import { RoadmapStep } from '../entities/roadmap-step.entity';
import { User } from '../entities/user.entity';
import { CreateThreadDto } from './dto/create-thread.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
export declare class ThreadsService {
    private threadRepository;
    private commentRepository;
    private roadmapRepository;
    private roadmapStepRepository;
    constructor(threadRepository: Repository<Thread>, commentRepository: Repository<Comment>, roadmapRepository: Repository<Roadmap>, roadmapStepRepository: Repository<RoadmapStep>);
    createThread(createThreadDto: CreateThreadDto, user: User): Promise<Thread>;
    getThreadsByRoadmap(roadmapId: number): Promise<{
        author: any;
        replies: any[];
        likes: number;
        hasLiked: boolean;
        id: number;
        roadmapId: number;
        stepId: number;
        title: string;
        userId: number;
        user: any;
        roadmap: any;
        step: any;
        comments: any[];
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    createComment(threadId: number, createCommentDto: CreateCommentDto, user: User): Promise<Comment>;
    getCommentsByThread(threadId: number): Promise<Comment[]>;
}
