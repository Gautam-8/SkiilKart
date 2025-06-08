import { Controller, Post, Get, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';

@Controller('resources')
export class ResourcesController {
  constructor(private resourcesService: ResourcesService) {}

  // POST /resources (Admin only)
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createResource(@Body() createResourceDto: CreateResourceDto, @Request() req) {
    return this.resourcesService.createResource(createResourceDto, req.user);
  }

  // GET /resources/by-step/:stepId
  @Get('by-step/:stepId')
  @UseGuards(JwtAuthGuard)
  async getResourcesByStep(@Param('stepId') stepId: string) {
    return this.resourcesService.getResourcesByStep(parseInt(stepId));
  }

  // DELETE /resources/:id (Admin only)
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteResource(@Param('id') id: string, @Request() req) {
    return this.resourcesService.deleteResource(parseInt(id), req.user);
  }
} 