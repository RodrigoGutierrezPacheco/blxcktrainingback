import { IsEmail, IsString, MinLength, IsNotEmpty, IsOptional } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../common/constants/validation-messages';

export class CreateNormalUserDto {
  @IsString({ message: VALIDATION_MESSAGES.FULL_NAME_IS_STRING })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.FULL_NAME_IS_NOT_EMPTY })
  fullName: string;

  @IsEmail({}, { message: VALIDATION_MESSAGES.EMAIL_IS_EMAIL })
  email: string;

  @IsString({ message: VALIDATION_MESSAGES.PASSWORD_IS_STRING })
  @MinLength(8, { message: VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH_8 })
  password: string;

  @IsString({ message: VALIDATION_MESSAGES.ROUTINE_IS_STRING })
  routine: string;

  @IsOptional()
  basicInfo?: {
    age?: number;
    weight?: number;
    height?: number;
    fitnessLevel?: string;
  };
}