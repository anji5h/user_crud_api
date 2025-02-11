import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;
}

export class ResponseDto<T> extends ErrorResponseDto {
  @ApiProperty()
  data?: T;
}
