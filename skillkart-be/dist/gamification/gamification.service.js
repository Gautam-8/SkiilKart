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
exports.GamificationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const xp_log_entity_1 = require("../entities/xp-log.entity");
const badge_entity_1 = require("../entities/badge.entity");
const user_badge_entity_1 = require("../entities/user-badge.entity");
const user_entity_1 = require("../entities/user.entity");
const user_roadmap_progress_entity_1 = require("../entities/user-roadmap-progress.entity");
let GamificationService = class GamificationService {
    xpLogRepository;
    badgeRepository;
    userBadgeRepository;
    userRoadmapProgressRepository;
    constructor(xpLogRepository, badgeRepository, userBadgeRepository, userRoadmapProgressRepository) {
        this.xpLogRepository = xpLogRepository;
        this.badgeRepository = badgeRepository;
        this.userBadgeRepository = userBadgeRepository;
        this.userRoadmapProgressRepository = userRoadmapProgressRepository;
    }
    async awardXPForStepCompletion(userId, stepId) {
        const points = 10;
        const xpLog = this.xpLogRepository.create({
            userId,
            action: `Completed step ${stepId}`,
            points,
        });
        await this.xpLogRepository.save(xpLog);
        await this.checkAndAwardBadges(userId);
        return xpLog;
    }
    async checkAndAwardBadges(userId) {
        const completedSteps = await this.userRoadmapProgressRepository.count({
            where: {
                userRoadmap: { userId },
                status: user_roadmap_progress_entity_1.ProgressStatus.COMPLETED,
            },
        });
        if (completedSteps >= 1) {
            await this.awardBadgeIfNotExists(userId, 'Getting Started');
        }
    }
    async awardBadgeIfNotExists(userId, badgeName) {
        const badge = await this.badgeRepository.findOne({
            where: { name: badgeName },
        });
        if (!badge)
            return;
        const existingUserBadge = await this.userBadgeRepository.findOne({
            where: { userId, badgeId: badge.id },
        });
        if (!existingUserBadge) {
            const userBadge = this.userBadgeRepository.create({
                userId,
                badgeId: badge.id,
            });
            await this.userBadgeRepository.save(userBadge);
        }
    }
    async getUserXP(userId, user) {
        if (user.role !== user_entity_1.UserRole.LEARNER) {
            throw new common_1.ForbiddenException('Only learners can view XP');
        }
        const xpLogs = await this.xpLogRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
        const totalXP = xpLogs.reduce((sum, log) => sum + log.points, 0);
        return {
            totalXP,
            xpLogs,
        };
    }
    async getAllBadges() {
        return this.badgeRepository.find({
            order: { createdAt: 'ASC' },
        });
    }
    async getUserBadges(userId, user) {
        if (user.role !== user_entity_1.UserRole.LEARNER) {
            throw new common_1.ForbiddenException('Only learners can view badges');
        }
        const userBadges = await this.userBadgeRepository.find({
            where: { userId },
        });
        const allBadges = await this.getAllBadges();
        const badgesWithStatus = allBadges.map(badge => ({
            ...badge,
            earned: userBadges.some(ub => ub.badgeId === badge.id),
            earnedAt: userBadges.find(ub => ub.badgeId === badge.id)?.createdAt || null,
        }));
        return badgesWithStatus;
    }
    async initializeDefaultBadges() {
        const defaultBadges = [
            {
                name: 'Getting Started',
                description: 'Complete your first learning step',
            },
            {
                name: 'Roadmap Finisher',
                description: 'Complete all steps in a roadmap',
            },
            {
                name: 'Streak Master',
                description: 'Log in for 5 consecutive days',
            },
        ];
        for (const badgeData of defaultBadges) {
            const existingBadge = await this.badgeRepository.findOne({
                where: { name: badgeData.name },
            });
            if (!existingBadge) {
                const badge = this.badgeRepository.create(badgeData);
                await this.badgeRepository.save(badge);
            }
        }
    }
};
exports.GamificationService = GamificationService;
exports.GamificationService = GamificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(xp_log_entity_1.XPLog)),
    __param(1, (0, typeorm_1.InjectRepository)(badge_entity_1.Badge)),
    __param(2, (0, typeorm_1.InjectRepository)(user_badge_entity_1.UserBadge)),
    __param(3, (0, typeorm_1.InjectRepository)(user_roadmap_progress_entity_1.UserRoadmapProgress)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], GamificationService);
//# sourceMappingURL=gamification.service.js.map