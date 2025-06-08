import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Thread } from '../entities/thread.entity';
import { Comment } from '../entities/comment.entity';
import { Roadmap } from '../entities/roadmap.entity';
import { RoadmapStep } from '../entities/roadmap-step.entity';
import { ThreadsService } from './threads.service';
import { ThreadsController } from './threads.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Thread, Comment, Roadmap, RoadmapStep]),
    AuthModule,
  ],
  controllers: [ThreadsController],
  providers: [ThreadsService],
  exports: [ThreadsService],
})
export class ThreadsModule {} 