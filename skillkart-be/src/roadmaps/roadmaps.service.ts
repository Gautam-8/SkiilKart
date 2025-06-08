import { Injectable, NotFoundException, ForbiddenException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roadmap } from '../entities/roadmap.entity';
import { RoadmapStep } from '../entities/roadmap-step.entity';
import { UserRoadmap } from '../entities/user-roadmap.entity';
import { UserRoadmapProgress, ProgressStatus } from '../entities/user-roadmap-progress.entity';
import { User, UserRole } from '../entities/user.entity';
import { CreateUserRoadmapDto } from './dto/create-user-roadmap.dto';
import { UpdateStepProgressDto } from './dto/update-step-progress.dto';
import { GamificationService } from '../gamification/gamification.service';



@Injectable()
export class RoadmapsService {
  constructor(
    @InjectRepository(Roadmap)
    private roadmapRepository: Repository<Roadmap>,
    @InjectRepository(RoadmapStep)
    private roadmapStepRepository: Repository<RoadmapStep>,
    @InjectRepository(UserRoadmap)
    private userRoadmapRepository: Repository<UserRoadmap>,
    @InjectRepository(UserRoadmapProgress)
    private userRoadmapProgressRepository: Repository<UserRoadmapProgress>,
    @Inject(forwardRef(() => GamificationService))
    private gamificationService: GamificationService,
  ) {}

  // GET /roadmaps - Return all roadmaps from database
  async getAllRoadmaps() {
    return await this.roadmapRepository.find();
  }

  // GET /roadmaps/:id - Return single roadmap by ID
  async getRoadmapById(id: number) {
    const roadmap = await this.roadmapRepository.findOne({
      where: { id }
    });

    if (!roadmap) {
      throw new NotFoundException('Roadmap not found');
    }

    return roadmap;
  }

  // GET /roadmaps/skill/:skillCategory - Return roadmaps by skill category
  async getRoadmapsBySkill(skillCategory: string) {
    return await this.roadmapRepository.find({
      where: { skillCategory }
    });
  }

  // GET /roadmaps/:id/steps - Return roadmap steps
  async getRoadmapSteps(roadmapId: number) {
    const steps = await this.roadmapStepRepository.find({
      where: { roadmapId },
      order: { weekNumber: 'ASC', id: 'ASC' }
    });
    
    // Map weekNumber to week for frontend compatibility
    return steps.map(step => ({
      ...step,
      week: step.weekNumber
    }));
  }

  // POST /user-roadmaps
  async startUserRoadmap(userId: number, createUserRoadmapDto: CreateUserRoadmapDto, user: User) {
    // Only learners can start roadmaps
    if (user.role !== UserRole.LEARNER) {
      throw new ForbiddenException('Only learners can start roadmaps');
    }

    const { roadmapId } = createUserRoadmapDto;

    // Check if roadmap exists in database
    const roadmap = await this.roadmapRepository.findOne({ where: { id: roadmapId } });
    if (!roadmap) {
      throw new NotFoundException('Roadmap not found');
    }

    // Check if user already started this roadmap
    const existingUserRoadmap = await this.userRoadmapRepository.findOne({
      where: { userId, roadmapId },
    });

    if (existingUserRoadmap) {
      return existingUserRoadmap;
    }

    // Create user roadmap
    const userRoadmap = this.userRoadmapRepository.create({
      userId,
      roadmapId,
      startedAt: new Date(),
    });

    await this.userRoadmapRepository.save(userRoadmap);

    return userRoadmap;
  }

  // GET /user-roadmaps/:id
  async getUserRoadmap(id: number, userId: number) {
    const userRoadmap = await this.userRoadmapRepository.findOne({
      where: { id, userId },
    });

    if (!userRoadmap) {
      throw new NotFoundException('User roadmap not found');
    }

    // Get roadmap details from database
    const roadmap = await this.roadmapRepository.findOne({ where: { id: userRoadmap.roadmapId } });
    if (!roadmap) {
      throw new NotFoundException('Roadmap not found');
    }

    // Get user's progress for this roadmap
    const progress = await this.userRoadmapProgressRepository.find({
      where: { userRoadmapId: userRoadmap.id }
    });

    return {
      ...userRoadmap,
      roadmap,
      progress,
    };
  }

  // GET /user-roadmaps/roadmap/:roadmapId - Get user progress by roadmap ID
  async getUserRoadmapByRoadmapId(roadmapId: number, userId: number) {
    console.log(`[PROGRESS] Retrieving progress: userId=${userId}, roadmapId=${roadmapId}`);
    
    // First find the user roadmap by roadmap ID and user ID
    const userRoadmap = await this.userRoadmapRepository.findOne({
      where: { roadmapId, userId },
    });

    if (!userRoadmap) {
      console.log(`[PROGRESS] No user roadmap found, returning empty progress`);
      // Return empty progress if user hasn't started this roadmap
      return {
        roadmapId,
        userId,
        progress: []
      };
    }

    console.log(`[PROGRESS] Found userRoadmap with id=${userRoadmap.id}`);

    // Get user's progress for this roadmap
    const progress = await this.userRoadmapProgressRepository.find({
      where: { userRoadmapId: userRoadmap.id }
    });

    console.log(`[PROGRESS] Retrieved ${progress.length} progress entries:`, progress);

    return {
      ...userRoadmap,
      progress,
    };
  }

  // PATCH /user-roadmaps/:id/step-progress
  async updateStepProgress(
    userRoadmapId: number,
    updateStepProgressDto: UpdateStepProgressDto,
    userId: number,
  ) {
    const { stepId, status } = updateStepProgressDto;

    // Verify user roadmap belongs to the user
    const userRoadmap = await this.userRoadmapRepository.findOne({
      where: { id: userRoadmapId, userId },
    });

    if (!userRoadmap) {
      throw new NotFoundException('User roadmap not found');
    }

    // Find existing progress
    const existingProgress = await this.userRoadmapProgressRepository.findOne({
      where: { userRoadmapId, stepId },
    });

    if (!existingProgress) {
      // Create new progress if doesn't exist
      const progress = this.userRoadmapProgressRepository.create({
        userRoadmapId,
        stepId,
        status,
      });
      await this.userRoadmapProgressRepository.save(progress);
    } else {
      // Update existing progress
      await this.userRoadmapProgressRepository.update(
        { userRoadmapId, stepId },
        { status },
      );
    }

    // Award XP if step was completed
    if (status === ProgressStatus.COMPLETED) {
      await this.gamificationService.awardXPForStepCompletion(userId, stepId);
    }

    return { success: true, status };
  }

  // PATCH /user-roadmaps/roadmap/:roadmapId/step-progress - Update step progress by roadmap ID
  async updateStepProgressByRoadmapId(
    roadmapId: number,
    updateStepProgressDto: UpdateStepProgressDto,
    userId: number,
  ) {
    const { stepId, status } = updateStepProgressDto;
    console.log(`[PROGRESS] Updating progress: userId=${userId}, roadmapId=${roadmapId}, stepId=${stepId}, status=${status}`);

    // Find user roadmap by roadmap ID and user ID
    let userRoadmap = await this.userRoadmapRepository.findOne({
      where: { roadmapId, userId },
    });

    // If user hasn't started this roadmap yet, create it
    if (!userRoadmap) {
      console.log(`[PROGRESS] Creating new user roadmap for userId=${userId}, roadmapId=${roadmapId}`);
      userRoadmap = this.userRoadmapRepository.create({
        userId,
        roadmapId,
        startedAt: new Date(),
      });
      await this.userRoadmapRepository.save(userRoadmap);
      console.log(`[PROGRESS] Created userRoadmap with id=${userRoadmap.id}`);
    }

    // Find existing progress
    const existingProgress = await this.userRoadmapProgressRepository.findOne({
      where: { userRoadmapId: userRoadmap.id, stepId },
    });

    if (!existingProgress) {
      // Create new progress if doesn't exist
      console.log(`[PROGRESS] Creating new progress entry`);
      const progress = this.userRoadmapProgressRepository.create({
        userRoadmapId: userRoadmap.id,
        stepId,
        status,
      });
      const savedProgress = await this.userRoadmapProgressRepository.save(progress);
      console.log(`[PROGRESS] Created progress entry:`, savedProgress);
    } else {
      // Update existing progress
      console.log(`[PROGRESS] Updating existing progress entry`);
      await this.userRoadmapProgressRepository.update(
        { userRoadmapId: userRoadmap.id, stepId },
        { status },
      );
      console.log(`[PROGRESS] Updated progress to status=${status}`);
    }

    // Award XP if step was completed
    if (status === ProgressStatus.COMPLETED) {
      await this.gamificationService.awardXPForStepCompletion(userId, stepId);
    }

    return { success: true, status };
  }
} 