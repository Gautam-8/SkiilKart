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
        console.log(`[GAMIFICATION] Awarding XP: userId=${userId}, stepId=${stepId}`);
        const points = 10;
        const xpLog = this.xpLogRepository.create({
            userId,
            action: `Completed step ${stepId}`,
            points,
        });
        const savedXpLog = await this.xpLogRepository.save(xpLog);
        console.log(`[GAMIFICATION] XP awarded successfully:`, savedXpLog);
        await this.checkAndAwardBadges(userId);
        return savedXpLog;
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
    async calculateUserStreaks(userId) {
        const xpLogs = await this.xpLogRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
        if (xpLogs.length === 0) {
            return { currentStreak: 0, longestStreak: 0 };
        }
        const activityDates = new Set();
        xpLogs.forEach(log => {
            const dateStr = log.createdAt.toISOString().split('T')[0];
            activityDates.add(dateStr);
        });
        const sortedDates = Array.from(activityDates).sort().reverse();
        if (sortedDates.length === 0) {
            return { currentStreak: 0, longestStreak: 0 };
        }
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        let currentStreak = 0;
        if (sortedDates[0] === today || sortedDates[0] === yesterday) {
            currentStreak = 1;
            for (let i = 1; i < sortedDates.length; i++) {
                const currentDate = new Date(sortedDates[i - 1]);
                const nextDate = new Date(sortedDates[i]);
                const dayDifference = (currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24);
                if (dayDifference === 1) {
                    currentStreak++;
                }
                else {
                    break;
                }
            }
        }
        let longestStreak = 0;
        let tempStreak = 1;
        for (let i = 1; i < sortedDates.length; i++) {
            const currentDate = new Date(sortedDates[i - 1]);
            const nextDate = new Date(sortedDates[i]);
            const dayDifference = (currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24);
            if (dayDifference === 1) {
                tempStreak++;
            }
            else {
                longestStreak = Math.max(longestStreak, tempStreak);
                tempStreak = 1;
            }
        }
        longestStreak = Math.max(longestStreak, tempStreak);
        return { currentStreak, longestStreak };
    }
    async getGamificationData(userId, user) {
        console.log(`[GAMIFICATION] Getting gamification data for userId=${userId}`);
        if (user.role !== user_entity_1.UserRole.LEARNER) {
            throw new common_1.ForbiddenException('Only learners can view gamification data');
        }
        const xpData = await this.getUserXP(userId, user);
        console.log(`[GAMIFICATION] XP data:`, xpData);
        const allBadges = await this.getUserBadges(userId, user);
        const earnedBadges = allBadges.filter(badge => badge.earned);
        console.log(`[GAMIFICATION] Earned badges:`, earnedBadges);
        const streakData = await this.calculateUserStreaks(userId);
        console.log(`[GAMIFICATION] Streak data:`, streakData);
        const level = Math.floor(xpData.totalXP / 1000) + 1;
        const xpInCurrentLevel = xpData.totalXP % 1000;
        const xpToNextLevel = 1000 - xpInCurrentLevel;
        const gamificationData = {
            totalXP: xpData.totalXP,
            level,
            xpToNextLevel,
            currentStreak: streakData.currentStreak,
            longestStreak: streakData.longestStreak,
            badges: earnedBadges.map(badge => ({
                id: badge.id,
                name: badge.name,
                description: badge.description,
                iconType: 'award',
                rarity: 'common',
                earnedAt: badge.earnedAt || new Date().toISOString(),
            })),
            achievements: [],
            xpLogs: xpData.xpLogs,
        };
        console.log(`[GAMIFICATION] Returning gamification data:`, gamificationData);
        return gamificationData;
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