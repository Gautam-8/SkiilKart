export declare enum UserRole {
    LEARNER = "Learner",
    ADMIN = "Admin"
}
export declare class User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    interests: string[];
    goal: string;
    availableWeeklyHours: number;
    userRoadmaps: any[];
    threads: any[];
    comments: any[];
    xpLogs: any[];
    userBadges: any[];
    createdAt: Date;
    updatedAt: Date;
}
