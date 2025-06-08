import { Controller, Post, Get, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ThreadsService } from './threads.service';
import { CreateThreadDto } from './dto/create-thread.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';

@Controller()
export class ThreadsController {
  constructor(private threadsService: ThreadsService) {}

  // POST /threads (Learners only)
  @Post('threads')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.LEARNER)
  async createThread(@Body() createThreadDto: CreateThreadDto, @Request() req) {
    return this.threadsService.createThread(createThreadDto, req.user);
  }

  // GET /threads/roadmap/:roadmapId
  @Get('threads/roadmap/:roadmapId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.LEARNER)
  async getThreadsByRoadmap(@Param('roadmapId') roadmapId: string) {
    return this.threadsService.getThreadsByRoadmap(parseInt(roadmapId));
  }

  // POST /comments (Learners only)
  @Post('threads/:threadId/comments')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.LEARNER)
  async createComment(
    @Param('threadId') threadId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req,
  ) {
    return this.threadsService.createComment(parseInt(threadId), createCommentDto, req.user);
  }

  // GET /comments/thread/:threadId
  @Get('comments/thread/:threadId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.LEARNER)
  async getCommentsByThread(@Param('threadId') threadId: string) {
    return this.threadsService.getCommentsByThread(parseInt(threadId));
  }
} 