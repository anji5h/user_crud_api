import { ApiProperty } from '@nestjs/swagger';
import { responseDto } from 'src/common/dto/response.dto';

export class Role {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class rolesResponseDto extends responseDto<Role[]> {
  @ApiProperty({
    type: [Role],
  })
  data?: Role[];
}
