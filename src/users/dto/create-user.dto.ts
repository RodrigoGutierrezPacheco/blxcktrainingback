import { IsEmail, IsString, MinLength, IsNotEmpty, Matches, IsOptional } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../common/constants/validation-messages';

export class CreateUserDto {
  @IsString({ message: VALIDATION_MESSAGES.FULL_NAME_IS_STRING })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.FULL_NAME_IS_NOT_EMPTY })
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, {
    message: VALIDATION_MESSAGES.FULL_NAME_MATCHES,
  })
  fullName: string;

  @IsEmail({}, { message: VALIDATION_MESSAGES.EMAIL_IS_EMAIL })
  email: string;

  @IsString({ message: VALIDATION_MESSAGES.PASSWORD_IS_STRING })
  @MinLength(8, { message: VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH_8 })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message: VALIDATION_MESSAGES.PASSWORD_PATTERN,
  })
  password: string;

  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @Matches(/^[\+]?[0-9\s\-\(\)]{10,20}$/, {
    message: 'El teléfono debe tener un formato válido (10-20 dígitos)',
  })
  phone?: string;
}