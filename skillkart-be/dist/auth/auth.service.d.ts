import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from '../entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private userRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: number;
            name: string;
            email: string;
            role: UserRole;
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
            role: UserRole;
            interests: string[];
            goal: string;
            availableWeeklyHours: number;
        };
    }>;
    getCurrentUser(userId: number): Promise<{
        id: number;
        name: string;
        email: string;
        role: UserRole;
        interests: string[];
        goal: string;
        availableWeeklyHours: number;
    }>;
}
