import { IsString, IsEnum, IsNumber, IsUrl } from 'class-validator';
import { ResourceType } from '../../entities/resource.entity';

export class CreateResourceDto {
  @IsNumber()
  stepId: number;

  @IsString()
  title: string;

  @IsEnum(ResourceType)
  type: ResourceType;

  @IsUrl()
  url: string;
} 