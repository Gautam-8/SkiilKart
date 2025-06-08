import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resource } from '../entities/resource.entity';
import { RoadmapStep } from '../entities/roadmap-step.entity';
import { ResourcesService } from './resources.service';
import { ResourcesController } from './resources.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Resource, RoadmapStep]),
    AuthModule,
  ],
  controllers: [ResourcesController],
  providers: [ResourcesService],
  exports: [ResourcesService],
})
export class ResourcesModule {} 