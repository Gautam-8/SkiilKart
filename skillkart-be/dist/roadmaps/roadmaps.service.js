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
const STATIC_ROADMAPS = [
    {
        id: 1,
        title: 'Complete Web Development Bootcamp',
        skillCategory: 'Web Development',
        description: 'Learn full-stack web development from scratch with HTML, CSS, JavaScript, React, and Node.js',
        totalWeeks: 12
    },
    {
        id: 2,
        title: 'Frontend Development Mastery',
        skillCategory: 'Frontend Development',
        description: 'Master modern frontend development with React, TypeScript, and advanced CSS',
        totalWeeks: 8
    },
    {
        id: 3,
        title: 'Backend Development Fundamentals',
        skillCategory: 'Backend Development',
        description: 'Build robust server-side applications with Node.js, databases, and APIs',
        totalWeeks: 10
    },
    {
        id: 4,
        title: 'Full Stack Development Journey',
        skillCategory: 'Full Stack Development',
        description: 'Complete full-stack mastery from frontend to backend deployment',
        totalWeeks: 16
    },
    {
        id: 5,
        title: 'UI/UX Design Fundamentals',
        skillCategory: 'UI/UX Design',
        description: 'Learn design principles, user research, prototyping, and design systems',
        totalWeeks: 10
    },
    {
        id: 6,
        title: 'Data Science with Python',
        skillCategory: 'Data Science',
        description: 'Master data analysis, machine learning, and visualization with Python',
        totalWeeks: 14
    },
    {
        id: 7,
        title: 'Machine Learning Engineering',
        skillCategory: 'Machine Learning',
        description: 'Build and deploy ML models from scratch to production',
        totalWeeks: 12
    },
    {
        id: 8,
        title: 'Mobile App Development',
        skillCategory: 'Mobile Development',
        description: 'Build native mobile apps with React Native and Flutter',
        totalWeeks: 10
    },
    {
        id: 9,
        title: 'DevOps Engineering Pipeline',
        skillCategory: 'DevOps',
        description: 'Master CI/CD, containerization, cloud deployment, and infrastructure automation',
        totalWeeks: 12
    },
    {
        id: 10,
        title: 'Game Development with Unity',
        skillCategory: 'Game Development',
        description: 'Create 2D and 3D games from concept to published product',
        totalWeeks: 14
    },
    {
        id: 11,
        title: 'Cybersecurity Specialist',
        skillCategory: 'Cybersecurity',
        description: 'Learn ethical hacking, security analysis, and threat protection',
        totalWeeks: 16
    },
    {
        id: 12,
        title: 'Cloud Computing Mastery',
        skillCategory: 'Cloud Computing',
        description: 'Master AWS, Azure, and cloud architecture patterns',
        totalWeeks: 12
    }
];
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
    async getRoadmapsBySkill(skillCategory) {
        const matchingRoadmaps = STATIC_ROADMAPS.filter(roadmap => roadmap.skillCategory.toLowerCase() === skillCategory.toLowerCase());
        return matchingRoadmaps;
    }
    async startUserRoadmap(userId, createUserRoadmapDto, user) {
        if (user.role !== user_entity_1.UserRole.LEARNER) {
            throw new common_1.ForbiddenException('Only learners can start roadmaps');
        }
        const { roadmapId } = createUserRoadmapDto;
        const roadmap = STATIC_ROADMAPS.find(r => r.id === roadmapId);
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
        const roadmap = STATIC_ROADMAPS.find(r => r.id === userRoadmap.roadmapId);
        if (!roadmap) {
            throw new common_1.NotFoundException('Roadmap not found');
        }
        return {
            ...userRoadmap,
            roadmap,
            steps: [],
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