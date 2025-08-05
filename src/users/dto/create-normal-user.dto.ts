import { IsEmail, IsString, MinLength, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateNormalUserDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  routine: string;

  @IsOptional()
  basicInfo?: {
    age?: number;
    weight?: number;
    height?: number;
    fitnessLevel?: string;
  };
}