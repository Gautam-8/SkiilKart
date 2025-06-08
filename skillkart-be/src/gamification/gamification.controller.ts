import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';

@Controller()
export class GamificationController {
  constructor(private gamificationService: GamificationService) {}

  // GET /xp (Learners only)
  @Get('xp')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.LEARNER)
  async getUserXP(@Request() req) {
    return this.gamificationService.getUserXP(req.user.id, req.user);
  }

  // GET /badges
  @Get('badges')
  @UseGuards(JwtAuthGuard)
  async getAllBadges() {
    return this.gamificationService.getAllBadges();
  }

  // GET /user-badges (Learners only)
  @Get('user-badges')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.LEARNER)
  async getUserBadges(@Request() req) {
    return this.gamificationService.getUserBadges(req.user.id, req.user);
  }
} 