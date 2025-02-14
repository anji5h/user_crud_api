import { Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Role } from 'src/common/decorators/role.decorator';
import { RolesResponseDto } from './dto/role-response.dto';
import { RoleService } from './role.service';

@ApiBearerAuth('JWT')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @Get()
  @Role('admin')
  @ApiResponse({
    type: RolesResponseDto,
  })
  async getRolesAsync() {
    const roles = await this.roleService.getRolesAsync();

    const response = new RolesResponseDto();
    response.message = 'SUCCESS';
    response.statusCode = 200;
    response.data = roles;

    return response;
  }

  @Post()
  async createRoleAsync() {}
}
