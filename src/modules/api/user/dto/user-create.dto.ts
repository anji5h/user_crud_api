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
import { ResponseDto } from 'src/common/dto/response.dto';

export class UserCreateRequestDto {
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
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @IsNotEmpty()
  password: string;
}

export class UserCreateResponseDto extends ResponseDto<null> {}
