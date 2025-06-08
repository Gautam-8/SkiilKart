"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreadsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const thread_entity_1 = require("../entities/thread.entity");
const comment_entity_1 = require("../entities/comment.entity");
const roadmap_entity_1 = require("../entities/roadmap.entity");
const roadmap_step_entity_1 = require("../entities/roadmap-step.entity");
const user_entity_1 = require("../entities/user.entity");
let ThreadsService = class ThreadsService {
    threadRepository;
    commentRepository;
    roadmapRepository;
    roadmapStepRepository;
    constructor(threadRepository, commentRepository, roadmapRepository, roadmapStepRepository) {
        this.threadRepository = threadRepository;
        this.commentRepository = commentRepository;
        this.roadmapRepository = roadmapRepository;
        this.roadmapStepRepository = roadmapStepRepository;
    }
    async createThread(createThreadDto, user) {
        if (user.role !== user_entity_1.UserRole.LEARNER) {
            throw new common_1.ForbiddenException('Only learners can create discussion threads');
        }
        const { roadmapId, stepId } = createThreadDto;
        const roadmap = await this.roadmapRepository.findOne({
            where: { id: roadmapId },
        });
        if (!roadmap) {
            throw new common_1.NotFoundException('Roadmap not found');
        }
        if (stepId) {
            const step = await this.roadmapStepRepository.findOne({
                where: { id: stepId, roadmapId },
            });
            if (!step) {
                throw new common_1.NotFoundException('Roadmap step not found');
            }
        }
        const thread = this.threadRepository.create({
            ...createThreadDto,
            userId: user.id,
        });
        await this.threadRepository.save(thread);
        return thread;
    }
    async getThreadsByRoadmap(roadmapId) {
        const roadmap = await this.roadmapRepository.findOne({
            where: { id: roadmapId },
        });
        if (!roadmap) {
            throw new common_1.NotFoundException('Roadmap not found');
        }
        const threads = await this.threadRepository.find({
            where: { roadmapId },
            relations: ['user', 'comments', 'comments.user'],
            order: { createdAt: 'DESC' },
        });
        return threads.map(thread => ({
            ...thread,
            author: thread.user,
            replies: thread.comments.map(comment => ({
                ...comment,
                author: comment.user
            })),
            likes: 0,
            hasLiked: false
        }));
    }
    async createComment(threadId, createCommentDto, user) {
        if (user.role !== user_entity_1.UserRole.LEARNER) {
            throw new common_1.ForbiddenException('Only learners can create comments');
        }
        const thread = await this.threadRepository.findOne({
            where: { id: threadId },
        });
        if (!thread) {
            throw new common_1.NotFoundException('Thread not found');
        }
        const comment = this.commentRepository.create({
            threadId,
            userId: user.id,
            content: createCommentDto.content,
        });
        await this.commentRepository.save(comment);
        return comment;
    }
    async getCommentsByThread(threadId) {
        const thread = await this.threadRepository.findOne({
            where: { id: threadId },
        });
        if (!thread) {
            throw new common_1.NotFoundException('Thread not found');
        }
        const comments = await this.commentRepository.find({
            where: { threadId },
            order: { createdAt: 'ASC' },
        });
        return comments;
    }
};
exports.ThreadsService = ThreadsService;
exports.ThreadsService = ThreadsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(thread_entity_1.Thread)),
    __param(1, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __param(2, (0, typeorm_1.InjectRepository)(roadmap_entity_1.Roadmap)),
    __param(3, (0, typeorm_1.InjectRepository)(roadmap_step_entity_1.RoadmapStep)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ThreadsService);
//# sourceMappingURL=threads.service.js.map