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
}
