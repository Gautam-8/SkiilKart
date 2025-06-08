import { Controller, Get, Post, Patch, Param, Body, UseGuards, Request } from '@nestjs/common';
import { RoadmapsService } from './roadmaps.service';
import { CreateUserRoadmapDto } from './dto/create-user-roadmap.dto';
import { CreateRoadmapDto } from './dto/create-roadmap.dto';
import { CreateRoadmapStepDto } from './dto/create-roadmap-step.dto';
import { UpdateStepProgressDto } from './dto/update-step-progress.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';

@Controller()
export class RoadmapsController {
  constructor(private roadmapsService: RoadmapsService) {}

  // POST /roadmaps - Create new roadmap (Admin only)
  @Post('roadmaps')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createRoadmap(@Body() createRoadmapDto: CreateRoadmapDto, @Request() req) {
    return this.roadmapsService.createRoadmap(createRoadmapDto, req.user);
  }

  // POST /roadmaps/:id/steps - Create new roadmap step (Admin only)
  @Post('roadmaps/:id/steps')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createRoadmapStep(@Param('id') id: string, @Body() createRoadmapStepDto: CreateRoadmapStepDto, @Request() req) {
    return this.roadmapsService.createRoadmapStep(parseInt(id), createRoadmapStepDto, req.user);
  }

  // GET /roadmaps - Get all roadmaps
  @Get('roadmaps')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.LEARNER, UserRole.ADMIN)
  async getAllRoadmaps() {
    return this.roadmapsService.getAllRoadmaps();
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