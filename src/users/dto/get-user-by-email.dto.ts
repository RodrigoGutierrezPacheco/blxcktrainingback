import { IsEmail, IsNotEmpty } from 'class-validator';

export class GetUserByEmailDto {
  @IsNotEmpty({ message: 'El email es requerido' })
  @IsEmail({}, { message: 'El formato del email no es válido' })
  email: string;
}
