import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Role } from 'src/common/decorators/role.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { rolesResponseDto } from './dto/roles-response.dto';
import { RoleService } from './role.service';

@Controller('role')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @Role('admin')
  @Get()
  @ApiResponse({
    type: rolesResponseDto,
  })
  async getRolesAsync() {
    const roles = await this.roleService.getRolesAsync();

    const response = new rolesResponseDto();
    response.message = 'success';
    response.statusCode = 200;
    response.data = roles;

    return response
  }
}
