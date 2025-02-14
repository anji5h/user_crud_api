import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { ResponseDto } from 'src/common/dto/response.dto';

export class VerifyEmailRepsonseDto extends ResponseDto<null> {}

export class UserVerifyRequestDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  otp: number;
}

export class UserVerifyRepsonseDto extends ResponseDto<null> {}
