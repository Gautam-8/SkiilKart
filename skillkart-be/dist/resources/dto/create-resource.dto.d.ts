import { ResourceType } from '../../entities/resource.entity';
export declare class CreateResourceDto {
    stepId: number;
    title: string;
    type: ResourceType;
    url: string;
}
