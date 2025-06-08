import { UsersService } from './users.service';
import { UpdateProfileDto } from '../auth/dto/update-profile.dto';
import { UserRole } from '../entities/user.entity';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    updateProfile(req: any, updateProfileDto: UpdateProfileDto): Promise<{
        id: number;
        name: string;
        email: string;
        role: UserRole;
        interests: string[];
        goal: string;
        availableWeeklyHours: number;
    }>;
}
