import { IsString, IsOptional } from 'class-validator';

export class ImageDto {
  @IsString()
  type: string;

  @IsString()
  url: string;
}
