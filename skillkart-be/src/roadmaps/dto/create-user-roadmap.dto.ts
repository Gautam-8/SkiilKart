import { IsNumber } from 'class-validator';

export class CreateUserRoadmapDto {
  @IsNumber()
  roadmapId: number;
} 