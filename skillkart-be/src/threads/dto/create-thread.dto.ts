import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateThreadDto {
  @IsNumber()
  roadmapId: number;

  @IsNumber()
  @IsOptional()
  stepId?: number;

  @IsString()
  title: string;
} 