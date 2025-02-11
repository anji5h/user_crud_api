import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from 'src/common/dto/response.dto';

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

class LoginResponse {
  @ApiProperty({
    type: User,
  })
  user: User;

  @ApiProperty()
  token: string;
}

export class LoginResponseDto extends ResponseDto<LoginResponse> {
  @ApiProperty({
    type: LoginResponse,
  })
  data: LoginResponse;
}
