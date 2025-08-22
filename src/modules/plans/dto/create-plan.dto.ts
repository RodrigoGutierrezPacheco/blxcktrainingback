import { IsString, IsNumber, IsArray, IsOptional, IsBoolean, Min, ArrayMinSize, IsIn, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BadgeDto } from './badge.dto';
import { ImageDto } from './image.dto';

export class CreatePlanDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  duration: string;

  @IsIn(['user', 'trainer'])
  @IsOptional()
  type?: 'user' | 'trainer';

  @IsString()
  @IsOptional()
  detail?: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  features: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => BadgeDto)
  badge?: BadgeDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ImageDto)
  image?: ImageDto;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
