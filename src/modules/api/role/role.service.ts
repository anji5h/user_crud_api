import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { Role } from 'src/common/decorators/role.decorator';

@Injectable()
@Role('admin')
export class RoleService {
  constructor(private readonly dbService: DatabaseService) {}

  async createRoleAsync(name: string) {
    await this.dbService.role.create({
      data: {
        name,
      },
    });
  }

  async createRolesAsync(names: string[]) {
    await this.dbService.role.createMany({
      data: names.map((name) => ({ name })),
      skipDuplicates: true,
    });
  }

  async getRolesAsync() {
    const roles = await this.dbService.role.findMany();
    return roles;
  }

  async getRoleAsync(name: string) {
    const role = await this.dbService.role.findUnique({
      where: {
        name,
      },
    });

    return role;
  }

  async updateRoleAsync(id: number, name: string) {
    await this.dbService.role.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });
  }

  async deleteRoleAsync(id: number) {
    await this.dbService.role.delete({
      where: {
        id,
      },
    });
  }
}
