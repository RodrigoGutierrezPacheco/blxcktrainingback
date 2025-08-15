import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../common/constants/validation-messages';

export class LoginTrainerDto {
  @IsEmail({}, { message: VALIDATION_MESSAGES.EMAIL_INVALID })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.EMAIL_REQUIRED })
  email: string;

  @IsString({ message: VALIDATION_MESSAGES.PASSWORD_IS_STRING })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.PASSWORD_REQUIRED })
  password: string;
}