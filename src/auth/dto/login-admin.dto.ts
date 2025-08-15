import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../common/constants/validation-messages';

export class LoginAdminDto {
  @IsEmail({}, { message: VALIDATION_MESSAGES.EMAIL_INVALID })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.EMAIL_REQUIRED })
  email: string;

  @IsString({ message: VALIDATION_MESSAGES.PASSWORD_IS_STRING })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.PASSWORD_REQUIRED })
  @MinLength(10, { message: VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH_10 })
  password: string;
}