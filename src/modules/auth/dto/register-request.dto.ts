import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @Transform(({ value }) => value?.trim().toLowerCase())
  @IsString()
  @Length(3, 50, { message: 'Name must be between 3 and 50 characters long' })
  @Matches(/^[a-z ]+$/, { message: 'Name can only contain letters and spaces' })
  name: string;

  @ApiProperty()
  @Transform(({ value }) => value?.trim().toLowerCase())
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}
