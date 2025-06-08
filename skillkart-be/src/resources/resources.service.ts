import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resource } from '../entities/resource.entity';
import { RoadmapStep } from '../entities/roadmap-step.entity';
import { User, UserRole } from '../entities/user.entity';
import { CreateResourceDto } from './dto/create-resource.dto';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resource)
    private resourceRepository: Repository<Resource>,
    @InjectRepository(RoadmapStep)
    private roadmapStepRepository: Repository<RoadmapStep>,
  ) {}

  // POST /resources (Admin only)
  async createResource(createResourceDto: CreateResourceDto, user: User) {
    // Only admins can create resources
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can create resources');
    }

    const { stepId } = createResourceDto;

    // Verify step exists
    const step = await this.roadmapStepRepository.findOne({
      where: { id: stepId },
    });

    if (!step) {
      throw new NotFoundException('Roadmap step not found');
    }

    // Create resource
    const resource = this.resourceRepository.create(createResourceDto);
    await this.resourceRepository.save(resource);

    return resource;
  }

  // GET /resources/by-step/:stepId
  async getResourcesByStep(stepId: number) {
    // Verify step exists
    const step = await this.roadmapStepRepository.findOne({
      where: { id: stepId },
    });

    if (!step) {
      throw new NotFoundException('Roadmap step not found');
    }

    const resources = await this.resourceRepository.find({
      where: { stepId },
      order: { createdAt: 'ASC' },
    });

    return resources;
  }

  // DELETE /resources/:id (Admin only)
  async deleteResource(id: number, user: User) {
    // Only admins can delete resources
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can delete resources');
    }

    const resource = await this.resourceRepository.findOne({
      where: { id },
    });

    if (!resource) {
      throw new NotFoundException('Resource not found');
    }

    await this.resourceRepository.remove(resource);

    return { success: true, message: 'Resource deleted successfully' };
  }
} 