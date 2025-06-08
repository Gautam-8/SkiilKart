import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roadmap } from '../entities/roadmap.entity';
import { RoadmapStep } from '../entities/roadmap-step.entity';
import { UserRoadmap } from '../entities/user-roadmap.entity';
import { UserRoadmapProgress } from '../entities/user-roadmap-progress.entity';
import { RoadmapsService } from './roadmaps.service';
import { RoadmapsController } from './roadmaps.controller';
import { AuthModule } from '../auth/auth.module';
import { GamificationModule } from '../gamification/gamification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Roadmap,
      RoadmapStep,
      UserRoadmap,
      UserRoadmapProgress,
    ]),
    AuthModule,
    forwardRef(() => GamificationModule),
  ],
  controllers: [RoadmapsController],
  providers: [RoadmapsService],
  exports: [RoadmapsService],
})
export class RoadmapsModule {} 