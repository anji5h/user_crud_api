import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEmail, IsNotEmpty} from 'class-validator';

export class LoginRequestDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @Transform(({value})=>value.toLowerCase())
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ default: false })
  @IsBoolean()
  remember: boolean = false;
}
