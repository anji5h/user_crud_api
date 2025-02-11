import { ApiProperty } from '@nestjs/swagger';
import { responseDto } from 'src/common/dto/response.dto';

export class RegisterResponseDto extends responseDto<null> {
  @ApiProperty()
  data: null;
}
