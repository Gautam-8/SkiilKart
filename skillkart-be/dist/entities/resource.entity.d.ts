export declare enum ResourceType {
    VIDEO = "Video",
    BLOG = "Blog",
    QUIZ = "Quiz"
}
export declare class Resource {
    id: number;
    stepId: number;
    title: string;
    type: ResourceType;
    url: string;
    step: any;
    createdAt: Date;
    updatedAt: Date;
}
