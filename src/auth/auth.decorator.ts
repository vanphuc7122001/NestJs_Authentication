import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { TokenPayload } from './auth.interface';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as TokenPayload;
  },
);
