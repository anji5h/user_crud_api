import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from 'src/common/dto/response.dto';

export class Token {
  @ApiProperty()
  token: string;
}

export class TokenResponseDto extends ResponseDto<Token> {
  @ApiProperty()
  data: Token;
}
