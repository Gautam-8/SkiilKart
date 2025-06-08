import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { UpdateProfileDto } from '../auth/dto/update-profile.dto';
export declare class UsersService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    updateProfile(userId: number, updateProfileDto: UpdateProfileDto): Promise<{
        id: number;
        name: string;
        email: string;
        role: UserRole;
        interests: string[];
        goal: string;
        availableWeeklyHours: number;
    }>;
}
