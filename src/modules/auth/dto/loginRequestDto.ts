import { IsBoolean, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class loginRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @IsBoolean()
  remember = false;
}
