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
exports.RoadmapsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const roadmap_entity_1 = require("../entities/roadmap.entity");
const roadmap_step_entity_1 = require("../entities/roadmap-step.entity");
const user_roadmap_entity_1 = require("../entities/user-roadmap.entity");
const user_roadmap_progress_entity_1 = require("../entities/user-roadmap-progress.entity");
const user_entity_1 = require("../entities/user.entity");
const gamification_service_1 = require("../gamification/gamification.service");
let RoadmapsService = class RoadmapsService {
    roadmapRepository;
    roadmapStepRepository;
    userRoadmapRepository;
    userRoadmapProgressRepository;
    gamificationService;
    constructor(roadmapRepository, roadmapStepRepository, userRoadmapRepository, userRoadmapProgressRepository, gamificationService) {
        this.roadmapRepository = roadmapRepository;
        this.roadmapStepRepository = roadmapStepRepository;
        this.userRoadmapRepository = userRoadmapRepository;
        this.userRoadmapProgressRepository = userRoadmapProgressRepository;
        this.gamificationService = gamificationService;
    }
    async getAllRoadmaps() {
        return await this.roadmapRepository.find({
            relations: ['steps']
        });
    }
    async getRoadmapById(id) {
        const roadmap = await this.roadmapRepository.findOne({
            where: { id },
            relations: ['steps']
        });
        if (!roadmap) {
            throw new common_1.NotFoundException('Roadmap not found');
        }
        return roadmap;
    }
    async getRoadmapSteps(roadmapId) {
        const steps = await this.roadmapStepRepository.find({
            where: { roadmapId },
            order: { id: 'ASC' }
        });
        return steps;
    }
    async startUserRoadmap(userId, createUserRoadmapDto, user) {
        if (user.role !== user_entity_1.UserRole.LEARNER) {
            throw new common_1.ForbiddenException('Only learners can start roadmaps');
        }
        const { roadmapId } = createUserRoadmapDto;
        const roadmap = await this.roadmapRepository.findOne({ where: { id: roadmapId } });
        if (!roadmap) {
            throw new common_1.NotFoundException('Roadmap not found');
        }
        const existingUserRoadmap = await this.userRoadmapRepository.findOne({
            where: { userId, roadmapId },
        });
        if (existingUserRoadmap) {
            return existingUserRoadmap;
        }
        const userRoadmap = this.userRoadmapRepository.create({
            userId,
            roadmapId,
            startedAt: new Date(),
        });
        await this.userRoadmapRepository.save(userRoadmap);
        return userRoadmap;
    }
    async getUserRoadmap(id, userId) {
        const userRoadmap = await this.userRoadmapRepository.findOne({
            where: { id, userId },
        });
        if (!userRoadmap) {
            throw new common_1.NotFoundException('User roadmap not found');
        }
        const roadmap = await this.roadmapRepository.findOne({ where: { id: userRoadmap.roadmapId } });
        if (!roadmap) {
            throw new common_1.NotFoundException('Roadmap not found');
        }
        const progress = await this.userRoadmapProgressRepository.find({
            where: { userRoadmapId: userRoadmap.id }
        });
        return {
            ...userRoadmap,
            roadmap,
            progress,
        };
    }
    async getUserRoadmapByRoadmapId(roadmapId, userId) {
        console.log(`[PROGRESS] Retrieving progress: userId=${userId}, roadmapId=${roadmapId}`);
        const userRoadmap = await this.userRoadmapRepository.findOne({
            where: { roadmapId, userId },
        });
        if (!userRoadmap) {
            console.log(`[PROGRESS] No user roadmap found, returning empty progress`);
            return {
                roadmapId,
                userId,
                progress: []
            };
        }
        console.log(`[PROGRESS] Found userRoadmap with id=${userRoadmap.id}`);
        const progress = await this.userRoadmapProgressRepository.find({
            where: { userRoadmapId: userRoadmap.id }
        });
        console.log(`[PROGRESS] Retrieved ${progress.length} progress entries:`, progress);
        return {
            ...userRoadmap,
            progress,
        };
    }
    async updateStepProgress(userRoadmapId, updateStepProgressDto, userId) {
        const { stepId, status } = updateStepProgressDto;
        const userRoadmap = await this.userRoadmapRepository.findOne({
            where: { id: userRoadmapId, userId },
        });
        if (!userRoadmap) {
            throw new common_1.NotFoundException('User roadmap not found');
        }
        const existingProgress = await this.userRoadmapProgressRepository.findOne({
            where: { userRoadmapId, stepId },
        });
        if (!existingProgress) {
            const progress = this.userRoadmapProgressRepository.create({
                userRoadmapId,
                stepId,
                status,
            });
            await this.userRoadmapProgressRepository.save(progress);
        }
        else {
            await this.userRoadmapProgressRepository.update({ userRoadmapId, stepId }, { status });
        }
        if (status === user_roadmap_progress_entity_1.ProgressStatus.COMPLETED) {
            await this.gamificationService.awardXPForStepCompletion(userId, stepId);
        }
        return { success: true, status };
    }
    async updateStepProgressByRoadmapId(roadmapId, updateStepProgressDto, userId) {
        const { stepId, status } = updateStepProgressDto;
        console.log(`[PROGRESS] Updating progress: userId=${userId}, roadmapId=${roadmapId}, stepId=${stepId}, status=${status}`);
        let userRoadmap = await this.userRoadmapRepository.findOne({
            where: { roadmapId, userId },
        });
        if (!userRoadmap) {
            console.log(`[PROGRESS] Creating new user roadmap for userId=${userId}, roadmapId=${roadmapId}`);
            userRoadmap = this.userRoadmapRepository.create({
                userId,
                roadmapId,
                startedAt: new Date(),
            });
            await this.userRoadmapRepository.save(userRoadmap);
            console.log(`[PROGRESS] Created userRoadmap with id=${userRoadmap.id}`);
        }
        const existingProgress = await this.userRoadmapProgressRepository.findOne({
            where: { userRoadmapId: userRoadmap.id, stepId },
        });
        if (!existingProgress) {
            console.log(`[PROGRESS] Creating new progress entry`);
            const progress = this.userRoadmapProgressRepository.create({
                userRoadmapId: userRoadmap.id,
                stepId,
                status,
            });
            const savedProgress = await this.userRoadmapProgressRepository.save(progress);
            console.log(`[PROGRESS] Created progress entry:`, savedProgress);
        }
        else {
            console.log(`[PROGRESS] Updating existing progress entry`);
            await this.userRoadmapProgressRepository.update({ userRoadmapId: userRoadmap.id, stepId }, { status });
            console.log(`[PROGRESS] Updated progress to status=${status}`);
        }
        if (status === user_roadmap_progress_entity_1.ProgressStatus.COMPLETED) {
            await this.gamificationService.awardXPForStepCompletion(userId, stepId);
        }
        return { success: true, status };
    }
    async createRoadmap(createRoadmapDto, user) {
        if (user.role !== user_entity_1.UserRole.ADMIN) {
            throw new common_1.ForbiddenException('Only admins can create roadmaps');
        }
        const roadmap = this.roadmapRepository.create(createRoadmapDto);
        await this.roadmapRepository.save(roadmap);
        return roadmap;
    }
    async createRoadmapStep(roadmapId, createRoadmapStepDto, user) {
        if (user.role !== user_entity_1.UserRole.ADMIN) {
            throw new common_1.ForbiddenException('Only admins can create roadmap steps');
        }
        const roadmap = await this.roadmapRepository.findOne({ where: { id: roadmapId } });
        if (!roadmap) {
            throw new common_1.NotFoundException('Roadmap not found');
        }
        const stepData = { ...createRoadmapStepDto, roadmapId };
        const step = this.roadmapStepRepository.create(stepData);
        await this.roadmapStepRepository.save(step);
        return step;
    }
};
exports.RoadmapsService = RoadmapsService;
exports.RoadmapsService = RoadmapsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(roadmap_entity_1.Roadmap)),
    __param(1, (0, typeorm_1.InjectRepository)(roadmap_step_entity_1.RoadmapStep)),
    __param(2, (0, typeorm_1.InjectRepository)(user_roadmap_entity_1.UserRoadmap)),
    __param(3, (0, typeorm_1.InjectRepository)(user_roadmap_progress_entity_1.UserRoadmapProgress)),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => gamification_service_1.GamificationService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        gamification_service_1.GamificationService])
], RoadmapsService);
//# sourceMappingURL=roadmaps.service.js.map