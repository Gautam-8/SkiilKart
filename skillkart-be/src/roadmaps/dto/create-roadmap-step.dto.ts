import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';

export enum StepType {
  VIDEOS = 'Videos',
  BLOGS = 'Blogs',
  QUIZZES = 'Quizzes',
}

export class CreateRoadmapStepDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(StepType)
  type: StepType;

  @IsNumber()
  roadmapId: number;

  @IsNumber()
  @IsOptional()
  estimatedHours?: number;

  @IsString()
  @IsOptional()
  learningObjectives?: string;
} 