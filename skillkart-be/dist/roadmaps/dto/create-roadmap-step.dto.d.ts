export declare enum StepType {
    VIDEOS = "Videos",
    BLOGS = "Blogs",
    QUIZZES = "Quizzes"
}
export declare class CreateRoadmapStepDto {
    title: string;
    description: string;
    type: StepType;
    roadmapId: number;
    estimatedHours?: number;
    learningObjectives?: string;
}
