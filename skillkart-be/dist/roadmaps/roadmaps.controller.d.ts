import { RoadmapsService } from './roadmaps.service';
import { CreateUserRoadmapDto } from './dto/create-user-roadmap.dto';
import { CreateRoadmapDto } from './dto/create-roadmap.dto';
import { CreateRoadmapStepDto } from './dto/create-roadmap-step.dto';
import { UpdateStepProgressDto } from './dto/update-step-progress.dto';
export declare class RoadmapsController {
    private roadmapsService;
    constructor(roadmapsService: RoadmapsService);
    createRoadmap(createRoadmapDto: CreateRoadmapDto, req: any): Promise<import("../entities").Roadmap>;
    createRoadmapStep(id: string, createRoadmapStepDto: CreateRoadmapStepDto, req: any): Promise<import("../entities").RoadmapStep>;
    getAllRoadmaps(): Promise<import("../entities").Roadmap[]>;
    getRoadmapById(id: string): Promise<import("../entities").Roadmap>;
    getRoadmapSteps(id: string): Promise<import("../entities").RoadmapStep[]>;
    startUserRoadmap(req: any, createUserRoadmapDto: CreateUserRoadmapDto): Promise<import("../entities").UserRoadmap>;
    getUserRoadmap(id: string, req: any): Promise<{
        roadmap: import("../entities").Roadmap;
        progress: import("../entities").UserRoadmapProgress[];
        id: number;
        userId: number;
        roadmapId: number;
        startedAt: Date;
        user: any;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getUserRoadmapByRoadmapId(roadmapId: string, req: any): Promise<{
        roadmapId: number;
        userId: number;
        progress: never[];
    } | {
        progress: import("../entities").UserRoadmapProgress[];
        id: number;
        userId: number;
        roadmapId: number;
        startedAt: Date;
        user: any;
        roadmap: any;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateStepProgress(id: string, updateStepProgressDto: UpdateStepProgressDto, req: any): Promise<{
        success: boolean;
        status: import("../entities").ProgressStatus;
    }>;
    updateStepProgressByRoadmapId(roadmapId: string, updateStepProgressDto: UpdateStepProgressDto, req: any): Promise<{
        success: boolean;
        status: import("../entities").ProgressStatus;
    }>;
}
