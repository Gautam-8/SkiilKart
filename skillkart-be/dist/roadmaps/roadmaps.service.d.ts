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
    getAllRoadmaps(): Promise<Roadmap[]>;
    getRoadmapById(id: number): Promise<Roadmap>;
    getRoadmapsBySkill(skillCategory: string): Promise<Roadmap[]>;
    getRoadmapSteps(roadmapId: number): Promise<{
        week: number;
        id: number;
        roadmapId: number;
        weekNumber: number;
        title: string;
        description: string;
        type: string;
        duration: string;
        roadmap: any;
        resources: any[];
        userProgress: any[];
        threads: any[];
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    startUserRoadmap(userId: number, createUserRoadmapDto: CreateUserRoadmapDto, user: User): Promise<UserRoadmap>;
    getUserRoadmap(id: number, userId: number): Promise<{
        roadmap: Roadmap;
        progress: UserRoadmapProgress[];
        id: number;
        userId: number;
        roadmapId: number;
        startedAt: Date;
        user: any;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getUserRoadmapByRoadmapId(roadmapId: number, userId: number): Promise<{
        roadmapId: number;
        userId: number;
        progress: never[];
    } | {
        progress: UserRoadmapProgress[];
        id: number;
        userId: number;
        roadmapId: number;
        startedAt: Date;
        user: any;
        roadmap: any;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateStepProgress(userRoadmapId: number, updateStepProgressDto: UpdateStepProgressDto, userId: number): Promise<{
        success: boolean;
        status: ProgressStatus;
    }>;
    updateStepProgressByRoadmapId(roadmapId: number, updateStepProgressDto: UpdateStepProgressDto, userId: number): Promise<{
        success: boolean;
        status: ProgressStatus;
    }>;
}
