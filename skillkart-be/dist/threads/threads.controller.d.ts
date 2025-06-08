import { ThreadsService } from './threads.service';
import { CreateThreadDto } from './dto/create-thread.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
export declare class ThreadsController {
    private threadsService;
    constructor(threadsService: ThreadsService);
    createThread(createThreadDto: CreateThreadDto, req: any): Promise<import("../entities").Thread>;
    getThreadsByRoadmap(roadmapId: string): Promise<import("../entities").Thread[]>;
    createComment(threadId: string, createCommentDto: CreateCommentDto, req: any): Promise<import("../entities").Comment>;
    getCommentsByThread(threadId: string): Promise<import("../entities").Comment[]>;
}
