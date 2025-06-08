export declare enum ProgressStatus {
    NOT_STARTED = "NOT_STARTED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED"
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
