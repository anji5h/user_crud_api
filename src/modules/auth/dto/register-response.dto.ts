import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from 'src/common/dto/response.dto';

export class RegisterResponseDto extends ResponseDto<null> {
  @ApiProperty()
  data: null;
}
