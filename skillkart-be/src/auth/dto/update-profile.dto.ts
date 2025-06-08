import { IsString, IsOptional, IsArray, IsNumber } from 'class-validator';

export class UpdateProfileDto {
  @IsArray()
  @IsOptional()
  interests?: string[];

  @IsString()
  @IsOptional()
  goal?: string;

  @IsNumber()
  @IsOptional()
  availableWeeklyHours?: number;
} 