import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { UpdateProfileDto } from '../auth/dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Allow learners and admins to update profile
    if (user.role !== UserRole.LEARNER && user.role !== UserRole.ADMIN) {
      throw new NotFoundException('Profile update only available for learners and admins');
    }

    await this.userRepository.update(userId, updateProfileDto);

    const updatedUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!updatedUser) {
      throw new NotFoundException('User not found after update');
    }

    // Remove password and other sensitive fields from response
    const { password, ...userResponse } = updatedUser;
    return userResponse;
  }
} 