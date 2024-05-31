import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { RolesSystem } from '../enums';
import { TokenPayload } from '../types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const { role: roleFromReq } = request['user'] as TokenPayload;

    const roleFromDecorator = this.reflector.get<RolesSystem[]>(
      'roles',
      context.getHandler(),
    );

    if (!roleFromDecorator) {
      return true;
    }

    const isPermission = this.checkPermission(roleFromDecorator, roleFromReq);

    if (!isPermission) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }

  private checkPermission(arrRole: RolesSystem[], roleUser): boolean {
    return arrRole.includes(roleUser);
  }
}
