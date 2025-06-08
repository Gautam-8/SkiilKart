import { IsEnum, IsNumber } from 'class-validator';
import { ProgressStatus } from '../../entities/user-roadmap-progress.entity';

export class UpdateStepProgressDto {
  @IsNumber()
  stepId: number;

  @IsEnum(ProgressStatus)
  status: ProgressStatus;
} 