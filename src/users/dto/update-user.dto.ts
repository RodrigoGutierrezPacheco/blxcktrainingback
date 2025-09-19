import { IsOptional, IsString, IsDateString, MinLength, MaxLength, IsNumber, Min, Max, Matches } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder los 100 caracteres' })
  fullName?: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha de nacimiento debe tener un formato válido (YYYY-MM-DD)' })
  dateOfBirth?: string;

  @IsOptional()
  @IsString({ message: 'Los problemas de salud deben ser una cadena de texto' })
  @MaxLength(1000, { message: 'Los problemas de salud no pueden exceder los 1000 caracteres' })
  healthIssues?: string;

  @IsOptional()
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password?: string;

  @IsOptional()
  @IsNumber({}, { message: 'La edad debe ser un número' })
  @Min(0, { message: 'La edad no puede ser menor a 0 años' })
  @Max(200, { message: 'La edad no puede ser mayor a 200 años' })
  age?: number;

  @IsOptional()
  @IsNumber({}, { message: 'El peso debe ser un número' })
  @Min(0, { message: 'El peso no puede ser menor a 0 kg' })
  @Max(1000, { message: 'El peso no puede ser mayor a 1000 kg' })
  weight?: number;

  @IsOptional()
  @IsNumber({}, { message: 'La altura debe ser un número' })
  @Min(0, { message: 'La altura no puede ser menor a 0 cm' })
  @Max(500, { message: 'La altura no puede ser mayor a 500 cm' })
  height?: number;

  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @Matches(/^[\+]?[0-9\s\-\(\)]{10,20}$/, {
    message: 'El teléfono debe tener un formato válido (10-20 dígitos)',
  })
  phone?: string;
}
