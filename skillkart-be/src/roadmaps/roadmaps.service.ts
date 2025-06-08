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

// Static roadmap data for common skills
const STATIC_ROADMAPS = [
  {
    id: 1,
    title: 'Complete Web Development Bootcamp',
    skillCategory: 'Web Development',
    description: 'Learn full-stack web development from scratch with HTML, CSS, JavaScript, React, and Node.js',
    totalWeeks: 12
  },
  {
    id: 2,
    title: 'Frontend Development Mastery',
    skillCategory: 'Frontend Development',
    description: 'Master modern frontend development with React, TypeScript, and advanced CSS',
    totalWeeks: 8
  },
  {
    id: 3,
    title: 'Backend Development Fundamentals',
    skillCategory: 'Backend Development',
    description: 'Build robust server-side applications with Node.js, databases, and APIs',
    totalWeeks: 10
  },
  {
    id: 4,
    title: 'Full Stack Development Journey',
    skillCategory: 'Full Stack Development',
    description: 'Complete full-stack mastery from frontend to backend deployment',
    totalWeeks: 16
  },
  {
    id: 5,
    title: 'UI/UX Design Fundamentals',
    skillCategory: 'UI/UX Design',
    description: 'Learn design principles, user research, prototyping, and design systems',
    totalWeeks: 10
  },
  {
    id: 6,
    title: 'Data Science with Python',
    skillCategory: 'Data Science',
    description: 'Master data analysis, machine learning, and visualization with Python',
    totalWeeks: 14
  },
  {
    id: 7,
    title: 'Machine Learning Engineering',
    skillCategory: 'Machine Learning',
    description: 'Build and deploy ML models from scratch to production',
    totalWeeks: 12
  },
  {
    id: 8,
    title: 'Mobile App Development',
    skillCategory: 'Mobile Development',
    description: 'Build native mobile apps with React Native and Flutter',
    totalWeeks: 10
  },
  {
    id: 9,
    title: 'DevOps Engineering Pipeline',
    skillCategory: 'DevOps',
    description: 'Master CI/CD, containerization, cloud deployment, and infrastructure automation',
    totalWeeks: 12
  },
  {
    id: 10,
    title: 'Game Development with Unity',
    skillCategory: 'Game Development',
    description: 'Create 2D and 3D games from concept to published product',
    totalWeeks: 14
  },
  {
    id: 11,
    title: 'Cybersecurity Specialist',
    skillCategory: 'Cybersecurity',
    description: 'Learn ethical hacking, security analysis, and threat protection',
    totalWeeks: 16
  },
  {
    id: 12,
    title: 'Cloud Computing Mastery',
    skillCategory: 'Cloud Computing',
    description: 'Master AWS, Azure, and cloud architecture patterns',
    totalWeeks: 12
  }
];

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

  // GET /roadmaps/skill/:skillCategory - Return static roadmaps for now
  async getRoadmapsBySkill(skillCategory: string) {
    // Return static roadmaps matching the skill category
    const matchingRoadmaps = STATIC_ROADMAPS.filter(
      roadmap => roadmap.skillCategory.toLowerCase() === skillCategory.toLowerCase()
    );
    
    return matchingRoadmaps;
  }

  // POST /user-roadmaps
  async startUserRoadmap(userId: number, createUserRoadmapDto: CreateUserRoadmapDto, user: User) {
    // Only learners can start roadmaps
    if (user.role !== UserRole.LEARNER) {
      throw new ForbiddenException('Only learners can start roadmaps');
    }

    const { roadmapId } = createUserRoadmapDto;

    // Check if roadmap exists in static data
    const roadmap = STATIC_ROADMAPS.find(r => r.id === roadmapId);
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

    // Get roadmap details from static data
    const roadmap = STATIC_ROADMAPS.find(r => r.id === userRoadmap.roadmapId);
    if (!roadmap) {
      throw new NotFoundException('Roadmap not found');
    }

    // For now, return basic structure - can be enhanced later
    return {
      ...userRoadmap,
      roadmap,
      steps: [], // Can add static steps later if needed
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
} 