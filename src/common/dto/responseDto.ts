import { ApiProperty } from '@nestjs/swagger';

export class errorResponseDto {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;
}

export class responseDto<T> extends errorResponseDto {
  @ApiProperty()
  data?: T;
}
