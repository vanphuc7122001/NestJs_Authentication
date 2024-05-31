import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { LoginUserDto } from 'src/modules/auth/dtos/auth.dto';
import { PrismaService } from 'src/shares/prisma/services/prisma.service';
import { hashPassword } from 'src/utils/crypto';

@Injectable()
export class LoginMiddleware implements NestMiddleware {
  constructor(private readonly prismaService: PrismaService) {}
  async use(
    req: Request<any, any, LoginUserDto>,
    res: Response,
    next: NextFunction,
  ) {
    const { email, password } = req.body;
    const foundUser = await this.prismaService.user.findFirst({
      where: {
        email,
        password: hashPassword(password),
      },
    });

    if (!foundUser) {
      throw new BadRequestException('Email or password is incorrect');
    }

    req['user'] = foundUser;
    return next();
  }
}
