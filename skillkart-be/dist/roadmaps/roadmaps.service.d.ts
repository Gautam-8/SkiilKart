import { Repository } from 'typeorm';
import { Roadmap } from '../entities/roadmap.entity';
import { RoadmapStep } from '../entities/roadmap-step.entity';
import { UserRoadmap } from '../entities/user-roadmap.entity';
import { UserRoadmapProgress, ProgressStatus } from '../entities/user-roadmap-progress.entity';
import { User } from '../entities/user.entity';
import { CreateUserRoadmapDto } from './dto/create-user-roadmap.dto';
import { UpdateStepProgressDto } from './dto/update-step-progress.dto';
import { GamificationService } from '../gamification/gamification.service';
export declare class RoadmapsService {
    private roadmapRepository;
    private roadmapStepRepository;
    private userRoadmapRepository;
    private userRoadmapProgressRepository;
    private gamificationService;
    constructor(roadmapRepository: Repository<Roadmap>, roadmapStepRepository: Repository<RoadmapStep>, userRoadmapRepository: Repository<UserRoadmap>, userRoadmapProgressRepository: Repository<UserRoadmapProgress>, gamificationService: GamificationService);
    getRoadmapsBySkill(skillCategory: string): Promise<{
        id: number;
        title: string;
        skillCategory: string;
        description: string;
        totalWeeks: number;
    }[]>;
    startUserRoadmap(userId: number, createUserRoadmapDto: CreateUserRoadmapDto, user: User): Promise<UserRoadmap>;
    getUserRoadmap(id: number, userId: number): Promise<{
        roadmap: {
            id: number;
            title: string;
            skillCategory: string;
            description: string;
            totalWeeks: number;
        };
        steps: never[];
        id: number;
        userId: number;
        roadmapId: number;
        startedAt: Date;
        user: any;
        progress: any[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateStepProgress(userRoadmapId: number, updateStepProgressDto: UpdateStepProgressDto, userId: number): Promise<{
        success: boolean;
        status: ProgressStatus;
    }>;
}
