import { OnModuleInit } from '@nestjs/common';
import { GamificationService } from './gamification/gamification.service';
export declare class AppService implements OnModuleInit {
    private gamificationService;
    constructor(gamificationService: GamificationService);
    onModuleInit(): Promise<void>;
    getHello(): string;
}
