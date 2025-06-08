import { Injectable, OnModuleInit } from '@nestjs/common';
import { GamificationService } from './gamification/gamification.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private gamificationService: GamificationService) {}

  async onModuleInit() {
    // Initialize default badges on startup
    await this.gamificationService.initializeDefaultBadges();
  }

  getHello(): string {
    return 'SkillKart Backend API is running!';
  }
}
