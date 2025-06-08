import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { XPLog } from '../entities/xp-log.entity';
import { Badge } from '../entities/badge.entity';
import { UserBadge } from '../entities/user-badge.entity';
import { User, UserRole } from '../entities/user.entity';
import { UserRoadmapProgress, ProgressStatus } from '../entities/user-roadmap-progress.entity';

@Injectable()
export class GamificationService {
  constructor(
    @InjectRepository(XPLog)
    private xpLogRepository: Repository<XPLog>,
    @InjectRepository(Badge)
    private badgeRepository: Repository<Badge>,
    @InjectRepository(UserBadge)
    private userBadgeRepository: Repository<UserBadge>,
    @InjectRepository(UserRoadmapProgress)
    private userRoadmapProgressRepository: Repository<UserRoadmapProgress>,
  ) {}

  // Award XP when step is completed
  async awardXPForStepCompletion(userId: number, stepId: number) {
    console.log(`[GAMIFICATION] Awarding XP: userId=${userId}, stepId=${stepId}`);
    const points = 10; // 10 XP per completed step
    
    const xpLog = this.xpLogRepository.create({
      userId,
      action: `Completed step ${stepId}`,
      points,
    });

    const savedXpLog = await this.xpLogRepository.save(xpLog);
    console.log(`[GAMIFICATION] XP awarded successfully:`, savedXpLog);

    // Check for badge eligibility
    await this.checkAndAwardBadges(userId);

    return savedXpLog;
  }

  // Check and award badges based on user progress
  async checkAndAwardBadges(userId: number) {
    const completedSteps = await this.userRoadmapProgressRepository.count({
      where: { 
        userRoadmap: { userId },
        status: ProgressStatus.COMPLETED,
      },
    });

    // Getting Started badge - 1 step complete
    if (completedSteps >= 1) {
      await this.awardBadgeIfNotExists(userId, 'Getting Started');
    }

    // TODO: Implement other badges
    // - Roadmap Finisher (all steps in a roadmap complete)
    // - Streak Master (logged in 5+ days)
  }

  // Award badge if user doesn't already have it
  async awardBadgeIfNotExists(userId: number, badgeName: string) {
    const badge = await this.badgeRepository.findOne({
      where: { name: badgeName },
    });

    if (!badge) return;

    const existingUserBadge = await this.userBadgeRepository.findOne({
      where: { userId, badgeId: badge.id },
    });

    if (!existingUserBadge) {
      const userBadge = this.userBadgeRepository.create({
        userId,
        badgeId: badge.id,
      });
      await this.userBadgeRepository.save(userBadge);
    }
  }

  // GET /xp (Learners only)
  async getUserXP(userId: number, user: User) {
    if (user.role !== UserRole.LEARNER) {
      throw new ForbiddenException('Only learners can view XP');
    }

    const xpLogs = await this.xpLogRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    const totalXP = xpLogs.reduce((sum, log) => sum + log.points, 0);

    return {
      totalXP,
      xpLogs,
    };
  }

  // GET /badges
  async getAllBadges() {
    return this.badgeRepository.find({
      order: { createdAt: 'ASC' },
    });
  }

  // GET /user-badges (Learners only)
  async getUserBadges(userId: number, user: User) {
    if (user.role !== UserRole.LEARNER) {
      throw new ForbiddenException('Only learners can view badges');
    }

    const userBadges = await this.userBadgeRepository.find({
      where: { userId },
    });

    const allBadges = await this.getAllBadges();

    // Return all badges with earned status
    const badgesWithStatus = allBadges.map(badge => ({
      ...badge,
      earned: userBadges.some(ub => ub.badgeId === badge.id),
      earnedAt: userBadges.find(ub => ub.badgeId === badge.id)?.createdAt || null,
    }));

    return badgesWithStatus;
  }

  // Calculate user streaks based on XP log activity
  async calculateUserStreaks(userId: number) {
    const xpLogs = await this.xpLogRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    if (xpLogs.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    // Group XP logs by date (YYYY-MM-DD format)
    const activityDates = new Set<string>();
    xpLogs.forEach(log => {
      const dateStr = log.createdAt.toISOString().split('T')[0];
      activityDates.add(dateStr);
    });

    // Convert to sorted array of date strings
    const sortedDates = Array.from(activityDates).sort().reverse();

    if (sortedDates.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    // Calculate current streak (from today backwards)
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    let currentStreak = 0;
    
    // Check if user was active today or yesterday (for grace period)
    if (sortedDates[0] === today || sortedDates[0] === yesterday) {
      currentStreak = 1;
      
      // Count consecutive days backwards
      for (let i = 1; i < sortedDates.length; i++) {
        const currentDate = new Date(sortedDates[i-1]);
        const nextDate = new Date(sortedDates[i]);
        const dayDifference = (currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24);
        
        if (dayDifference === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const currentDate = new Date(sortedDates[i-1]);
      const nextDate = new Date(sortedDates[i]);
      const dayDifference = (currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (dayDifference === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return { currentStreak, longestStreak };
  }

  // GET /gamification - Combined gamification data for frontend
  async getGamificationData(userId: number, user: User) {
    console.log(`[GAMIFICATION] Getting gamification data for userId=${userId}`);
    if (user.role !== UserRole.LEARNER) {
      throw new ForbiddenException('Only learners can view gamification data');
    }

    // Get XP data
    const xpData = await this.getUserXP(userId, user);
    console.log(`[GAMIFICATION] XP data:`, xpData);
    
    // Get badges data
    const allBadges = await this.getUserBadges(userId, user);
    const earnedBadges = allBadges.filter(badge => badge.earned);
    console.log(`[GAMIFICATION] Earned badges:`, earnedBadges);

    // Calculate streaks
    const streakData = await this.calculateUserStreaks(userId);
    console.log(`[GAMIFICATION] Streak data:`, streakData);

    // Calculate level based on XP (every 1000 XP = 1 level)
    const level = Math.floor(xpData.totalXP / 1000) + 1;
    const xpInCurrentLevel = xpData.totalXP % 1000;
    const xpToNextLevel = 1000 - xpInCurrentLevel;

    const gamificationData = {
      totalXP: xpData.totalXP,
      level,
      xpToNextLevel,
      currentStreak: streakData.currentStreak,
      longestStreak: streakData.longestStreak,
      badges: earnedBadges.map(badge => ({
        id: badge.id,
        name: badge.name,
        description: badge.description,
        iconType: 'award', // Default icon type
        rarity: 'common', // Default rarity
        earnedAt: badge.earnedAt || new Date().toISOString(),
      })),
      achievements: [], // TODO: Implement achievements system
      xpLogs: xpData.xpLogs,
    };

    console.log(`[GAMIFICATION] Returning gamification data:`, gamificationData);
    return gamificationData;
  }

  // Initialize default badges
  async initializeDefaultBadges() {
    const defaultBadges = [
      {
        name: 'Getting Started',
        description: 'Complete your first learning step',
      },
      {
        name: 'Roadmap Finisher',
        description: 'Complete all steps in a roadmap',
      },
      {
        name: 'Streak Master',
        description: 'Log in for 5 consecutive days',
      },
    ];

    for (const badgeData of defaultBadges) {
      const existingBadge = await this.badgeRepository.findOne({
        where: { name: badgeData.name },
      });

      if (!existingBadge) {
        const badge = this.badgeRepository.create(badgeData);
        await this.badgeRepository.save(badge);
      }
    }
  }
} 