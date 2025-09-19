import { IsEmail, IsString, MinLength, IsNotEmpty, IsOptional, Matches } from 'class-validator';
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
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @Matches(/^[\+]?[0-9\s\-\(\)]{10,20}$/, {
    message: 'El teléfono debe tener un formato válido (10-20 dígitos)',
  })
  phone?: string;

  @IsOptional()
  basicInfo?: {
    age?: number;
    weight?: number;
    height?: number;
    fitnessLevel?: string;
  };
}