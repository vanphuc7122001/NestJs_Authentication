import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { PrismaService } from 'src/shares/prisma/services/prisma.service';
import { RegisterUserDto } from 'src/modules/auth/dtos/auth.dto';

@Injectable()
export class RegisterMiddleware implements NestMiddleware {
  constructor(private readonly prismaService: PrismaService) {}
  async use(
    req: Request<any, any, RegisterUserDto>,
    res: Response,
    next: NextFunction,
  ) {
    const { email } = req.body;
    const foundUser = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });

    if (foundUser) {
      throw new BadRequestException('User already exists');
    }

    return next();
  }
}
