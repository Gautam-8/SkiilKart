import { IsString, IsArray, IsEnum, IsOptional } from 'class-validator';

export enum RoadmapDifficulty {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
}

export class CreateRoadmapDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(RoadmapDifficulty)
  difficulty: RoadmapDifficulty;

  @IsArray()
  @IsString({ each: true })
  skills: string[];
} 