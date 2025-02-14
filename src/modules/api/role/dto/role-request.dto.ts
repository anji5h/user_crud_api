import { ApiProperty } from '@nestjs/swagger';
import { IsAlpha, IsNotEmpty } from 'class-validator';

export class RoleCreateRequestDto {
  @ApiProperty()
  @IsAlpha()
  @IsNotEmpty()
  name: string;
}

export class RoleUpdateRequestDto extends RoleCreateRequestDto {}
