import { IsEmail } from 'class-validator';

export class GetUserRoutineByEmailDto {
  @IsEmail()
  email: string;
}
