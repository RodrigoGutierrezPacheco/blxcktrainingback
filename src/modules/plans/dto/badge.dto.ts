import { IsString, IsOptional } from 'class-validator';

export class BadgeDto {
  @IsString()
  color: string;

  @IsString()
  name: string;
}
