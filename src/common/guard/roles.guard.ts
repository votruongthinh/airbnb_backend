import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<number[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    console.log('RolesGuard check:', {
      requiredRoles,
      userRole: user?.roleId,
    });

    if (!user) {
      throw new ForbiddenException(`không có quyền truy cập`);
    }

    if (!requiredRoles.includes(user.roleId)) {
      throw new ForbiddenException(`Không đủ quyền`);
    }
    return true;
  }
}
