import { IsOptional, IsString, IsNumber, Min, Max, IsDateString, Length, Matches } from 'class-validator';

export class UpdateTrainerDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsNumber()
  @Min(18)
  @Max(100)
  age?: number;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  documents?: string;

  @IsOptional()
  @IsString()
  @Length(13, 13, { message: 'El RFC debe tener exactamente 13 caracteres' })
  @Matches(/^[A-Z]{4}[0-9]{6}[A-Z0-9]{3}$/, { message: 'Formato de RFC inválido' })
  rfc?: string;

  @IsOptional()
  @IsString()
  @Length(18, 18, { message: 'El CURP debe tener exactamente 18 caracteres' })
  @Matches(/^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9A-Z][0-9]$/, { message: 'Formato de CURP inválido' })
  curp?: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha de nacimiento debe ser una fecha válida' })
  dateOfBirth?: string;
}
