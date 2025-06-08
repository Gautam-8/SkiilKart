import { Repository } from 'typeorm';
import { XPLog } from '../entities/xp-log.entity';
import { Badge } from '../entities/badge.entity';
import { UserBadge } from '../entities/user-badge.entity';
import { User } from '../entities/user.entity';
import { UserRoadmapProgress } from '../entities/user-roadmap-progress.entity';
export declare class GamificationService {
    private xpLogRepository;
    private badgeRepository;
    private userBadgeRepository;
    private userRoadmapProgressRepository;
    constructor(xpLogRepository: Repository<XPLog>, badgeRepository: Repository<Badge>, userBadgeRepository: Repository<UserBadge>, userRoadmapProgressRepository: Repository<UserRoadmapProgress>);
    awardXPForStepCompletion(userId: number, stepId: number): Promise<XPLog>;
    checkAndAwardBadges(userId: number): Promise<void>;
    awardBadgeIfNotExists(userId: number, badgeName: string): Promise<void>;
    getUserXP(userId: number, user: User): Promise<{
        totalXP: number;
        xpLogs: XPLog[];
    }>;
    getAllBadges(): Promise<Badge[]>;
    getUserBadges(userId: number, user: User): Promise<{
        earned: boolean;
        earnedAt: Date | null;
        id: number;
        name: string;
        description: string;
        userBadges: any[];
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getGamificationData(userId: number, user: User): Promise<{
        totalXP: number;
        level: number;
        xpToNextLevel: number;
        currentStreak: number;
        longestStreak: number;
        badges: {
            id: number;
            name: string;
            description: string;
            iconType: string;
            rarity: string;
            earnedAt: string | Date;
        }[];
        achievements: never[];
        xpLogs: XPLog[];
    }>;
    initializeDefaultBadges(): Promise<void>;
}
