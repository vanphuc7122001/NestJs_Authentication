import {
  Injectable,
  NestMiddleware,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

import { ConfigService } from '@nestjs/config';
import { LogoutDto } from 'src/modules/auth/dtos/auth.dto';
import { PrismaService } from 'src/shares/prisma/services/prisma.service';
import { TokenPayload } from 'src/modules/auth/types/auth.type';

@Injectable()
export class RefreshTokenMiddleware implements NestMiddleware {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  async use(
    req: Request<any, any, LogoutDto>,
    res: Response,
    next: NextFunction,
  ) {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new NotFoundException('Refresh token is required');
    }

    try {
      const [decoded_refresh_token, refresh_token] = await Promise.all([
        this.jwtService.verifyAsync<Promise<TokenPayload>>(refreshToken, {
          secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        }),
        this.prismaService.refreshToken.findFirst({
          where: {
            token: refreshToken,
          },
        }),
      ]);

      if (!refresh_token) {
        throw new UnauthorizedException('Used refresh token or not exist');
      }

      req['RefreshToken'] = {
        ...decoded_refresh_token,
        refresh_token_id: refresh_token.id,
      };
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException(error.message);
      }
      throw error;
    }
    return next();
  }
}
