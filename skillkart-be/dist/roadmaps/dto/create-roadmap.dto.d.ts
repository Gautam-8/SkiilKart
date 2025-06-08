export declare enum RoadmapDifficulty {
    BEGINNER = "Beginner",
    INTERMEDIATE = "Intermediate",
    ADVANCED = "Advanced"
}
export declare class CreateRoadmapDto {
    title: string;
    description: string;
    difficulty: RoadmapDifficulty;
    skills: string[];
}
