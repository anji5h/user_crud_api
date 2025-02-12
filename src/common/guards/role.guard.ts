import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../decorators/role.decorator';
import { IJwtPayload } from '../types/jwt-payload.type';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const role = this.reflector.get(Role, context.getHandler());

    if (!role) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user as IJwtPayload;

    if (!user) throw new ForbiddenException('PERMISSION_DENIED');

    if (user.userRole !== role) {
      throw new ForbiddenException('PERMISSION_DENIED');
    }

    return true;
  }
}
