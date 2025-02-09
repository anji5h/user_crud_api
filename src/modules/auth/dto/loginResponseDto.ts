import { ApiProperty } from '@nestjs/swagger';
import { responseDto } from 'src/common/dto/responseDto';

class User {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: string;
}

class loginResponse {
  @ApiProperty({
    type: User,
  })
  user: User;

  @ApiProperty()
  token: string;
}

export class loginResponseDto extends responseDto<loginResponse> {
  @ApiProperty({
    type: loginResponse,
  })
  data: loginResponse;
}
