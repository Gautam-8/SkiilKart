import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
export declare class ResourcesController {
    private resourcesService;
    constructor(resourcesService: ResourcesService);
    createResource(createResourceDto: CreateResourceDto, req: any): Promise<import("../entities").Resource>;
    getResourcesByStep(stepId: string): Promise<import("../entities").Resource[]>;
    deleteResource(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
