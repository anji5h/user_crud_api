import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
} from 'class-validator';

export class registerRequestDto {
  @Transform(({ value }) => value?.trim().toLowerCase())
  @IsString()
  @Length(2, 50)
  @Matches(/^[a-zà-öø-ÿ' -]+$/, { message: 'Invalid name format' })
  name: string;

  @Transform(({ value }) => value?.trim().toLowerCase())
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}
