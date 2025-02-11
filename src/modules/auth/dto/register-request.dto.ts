import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
} from 'class-validator';

export class RegisterRequestDto {
  @Transform(({ value }) => value?.trim().toLowerCase())
  @IsString()
  @Length(3, 50, { message: 'Name must be between 3 and 50 characters long' })
  @Matches(/^[a-z ]+$/, { message: 'Name can only contain letters and spaces' })
  name: string;

  @Transform(({ value }) => value?.trim().toLowerCase())
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}
