import { GamificationService } from './gamification.service';
export declare class GamificationController {
    private gamificationService;
    constructor(gamificationService: GamificationService);
    getUserXP(req: any): Promise<{
        totalXP: number;
        xpLogs: import("../entities").XPLog[];
    }>;
    getAllBadges(): Promise<import("../entities").Badge[]>;
    getUserBadges(req: any): Promise<{
        earned: boolean;
        earnedAt: Date | null;
        id: number;
        name: string;
        description: string;
        userBadges: any[];
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getGamificationData(req: any): Promise<{
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
        xpLogs: import("../entities").XPLog[];
    }>;
}
