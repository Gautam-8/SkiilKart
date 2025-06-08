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

  // GET /roadmaps - Get all roadmaps
  @Get('roadmaps')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.LEARNER, UserRole.ADMIN)
  async getAllRoadmaps() {
    return this.roadmapsService.getAllRoadmaps();
  }

  // GET /roadmaps/skill/:skillCategory - Must come before /roadmaps/:id to avoid conflicts
  @Get('roadmaps/skill/:skillCategory')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.LEARNER, UserRole.ADMIN)
  async getRoadmapsBySkill(@Param('skillCategory') skillCategory: string) {
    return this.roadmapsService.getRoadmapsBySkill(skillCategory);
  }

  // GET /roadmaps/:id - Get single roadmap by ID
  @Get('roadmaps/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.LEARNER, UserRole.ADMIN)
  async getRoadmapById(@Param('id') id: string) {
    return this.roadmapsService.getRoadmapById(parseInt(id));
  }

  // GET /roadmaps/:id/steps - Get roadmap steps
  @Get('roadmaps/:id/steps')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.LEARNER, UserRole.ADMIN)
  async getRoadmapSteps(@Param('id') id: string) {
    return this.roadmapsService.getRoadmapSteps(parseInt(id));
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

  // GET /user-roadmaps/roadmap/:roadmapId - Get user progress by roadmap ID
  @Get('user-roadmaps/roadmap/:roadmapId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.LEARNER, UserRole.ADMIN)
  async getUserRoadmapByRoadmapId(@Param('roadmapId') roadmapId: string, @Request() req) {
    return this.roadmapsService.getUserRoadmapByRoadmapId(parseInt(roadmapId), req.user.id);
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

  // PATCH /user-roadmaps/roadmap/:roadmapId/step-progress - Update step progress by roadmap ID
  @Patch('user-roadmaps/roadmap/:roadmapId/step-progress')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.LEARNER, UserRole.ADMIN)
  async updateStepProgressByRoadmapId(
    @Param('roadmapId') roadmapId: string,
    @Body() updateStepProgressDto: UpdateStepProgressDto,
    @Request() req,
  ) {
    return this.roadmapsService.updateStepProgressByRoadmapId(
      parseInt(roadmapId),
      updateStepProgressDto,
      req.user.id,
    );
  }
} 