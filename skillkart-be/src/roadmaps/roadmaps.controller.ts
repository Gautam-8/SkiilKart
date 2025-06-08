import { Controller, Get, Post, Patch, Param, Body, UseGuards, Request } from '@nestjs/common';
import { RoadmapsService } from './roadmaps.service';
import { CreateUserRoadmapDto } from './dto/create-user-roadmap.dto';
import { UpdateStepProgressDto } from './dto/update-step-progress.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';

@Controller()
export class RoadmapsController {
  constructor(private roadmapsService: RoadmapsService) {}

  // GET /roadmaps/skill/:skillCategory
  @Get('roadmaps/skill/:skillCategory')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.LEARNER)
  async getRoadmapsBySkill(@Param('skillCategory') skillCategory: string) {
    return this.roadmapsService.getRoadmapsBySkill(skillCategory);
  }

  // POST /user-roadmaps
  @Post('user-roadmaps')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.LEARNER)
  async startUserRoadmap(@Request() req, @Body() createUserRoadmapDto: CreateUserRoadmapDto) {
    return this.roadmapsService.startUserRoadmap(req.user.id, createUserRoadmapDto, req.user);
  }

  // GET /user-roadmaps/:id
  @Get('user-roadmaps/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.LEARNER)
  async getUserRoadmap(@Param('id') id: string, @Request() req) {
    return this.roadmapsService.getUserRoadmap(parseInt(id), req.user.id);
  }

  // PATCH /user-roadmaps/:id/step-progress
  @Patch('user-roadmaps/:id/step-progress')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.LEARNER)
  async updateStepProgress(
    @Param('id') id: string,
    @Body() updateStepProgressDto: UpdateStepProgressDto,
    @Request() req,
  ) {
    return this.roadmapsService.updateStepProgress(
      parseInt(id),
      updateStepProgressDto,
      req.user.id,
    );
  }
} 