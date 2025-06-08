export declare enum ProgressStatus {
    IN_PROGRESS = "In Progress",
    COMPLETED = "Completed"
}
export declare class UserRoadmapProgress {
    id: number;
    userRoadmapId: number;
    stepId: number;
    status: ProgressStatus;
    userRoadmap: any;
    step: any;
    createdAt: Date;
    updatedAt: Date;
}
