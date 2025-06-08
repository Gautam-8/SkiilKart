import { Repository } from 'typeorm';
import { Resource } from '../entities/resource.entity';
import { RoadmapStep } from '../entities/roadmap-step.entity';
import { User } from '../entities/user.entity';
import { CreateResourceDto } from './dto/create-resource.dto';
export declare class ResourcesService {
    private resourceRepository;
    private roadmapStepRepository;
    constructor(resourceRepository: Repository<Resource>, roadmapStepRepository: Repository<RoadmapStep>);
    createResource(createResourceDto: CreateResourceDto, user: User): Promise<Resource>;
    getResourcesByStep(stepId: number): Promise<Resource[]>;
    deleteResource(id: number, user: User): Promise<{
        success: boolean;
        message: string;
    }>;
}
