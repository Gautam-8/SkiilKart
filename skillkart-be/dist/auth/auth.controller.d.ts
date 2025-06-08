import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: number;
            name: string;
            email: string;
            role: import("../entities").UserRole;
            interests: string[];
            goal: string;
            availableWeeklyHours: number;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: number;
            name: string;
            email: string;
            role: import("../entities").UserRole;
            interests: string[];
            goal: string;
            availableWeeklyHours: number;
        };
    }>;
    getCurrentUser(req: any): Promise<{
        id: number;
        name: string;
        email: string;
        role: import("../entities").UserRole;
        interests: string[];
        goal: string;
        availableWeeklyHours: number;
    }>;
}
