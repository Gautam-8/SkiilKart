import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RoadmapsModule } from './roadmaps/roadmaps.module';
import { ResourcesModule } from './resources/resources.module';
import { ThreadsModule } from './threads/threads.module';
import { GamificationModule } from './gamification/gamification.module';

// Import entities
import {
  User,
  Roadmap,
  RoadmapStep,
  UserRoadmap,
  UserRoadmapProgress,
  Resource,
  Thread,
  Comment,
  XPLog,
  Badge,
  UserBadge,
} from './entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DB_URL,
      entities: [
        User,
        Roadmap,
        RoadmapStep,
        UserRoadmap,
        UserRoadmapProgress,
        Resource,
        Thread,
        Comment,
        XPLog,
        Badge,
        UserBadge,
      ],
      synchronize: true,
       ssl: { rejectUnauthorized: false },
     }),
    AuthModule,
    UsersModule,
    RoadmapsModule,
    ResourcesModule,
    ThreadsModule,
    GamificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
