import { RoadmapsService } from './roadmaps.service';
import { CreateUserRoadmapDto } from './dto/create-user-roadmap.dto';
import { UpdateStepProgressDto } from './dto/update-step-progress.dto';
export declare class RoadmapsController {
    private roadmapsService;
    constructor(roadmapsService: RoadmapsService);
    getRoadmapsBySkill(skillCategory: string): Promise<{
        id: number;
        title: string;
        skillCategory: string;
        description: string;
        totalWeeks: number;
    }[]>;
    startUserRoadmap(req: any, createUserRoadmapDto: CreateUserRoadmapDto): Promise<import("../entities").UserRoadmap>;
    getUserRoadmap(id: string, req: any): Promise<{
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
    updateStepProgress(id: string, updateStepProgressDto: UpdateStepProgressDto, req: any): Promise<{
        success: boolean;
        status: import("../entities").ProgressStatus;
    }>;
}
