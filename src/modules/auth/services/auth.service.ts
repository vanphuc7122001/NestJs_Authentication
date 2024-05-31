import { BadRequestException, Injectable } from '@nestjs/common';
import { ResTokenType, TokenPayload } from '../types';

import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/shares/prisma/services/prisma.service';
import { RegisterUserDto } from '../dtos';
import { SuccessResponse } from 'src/common/cores/respone';
import { hashPassword } from 'src/utils/crypto';

const AVATAR =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMmQGIegpWiQtv70J38HzU4sZzDox3ebnhx9y4UZXEcw&s';
@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private async signAccessToken(payload: TokenPayload): Promise<string> {
    return await this.jwtService
      .signAsync(payload, {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: '1h',
      })
      .catch((err) => {
        throw new BadRequestException(err.message);
      });
  }

  private async signRefreshToken(payload: TokenPayload): Promise<string> {
    return await this.jwtService
      .signAsync(
        {
          ...payload,
          exp: payload.exp ? Number(payload.exp) : 60 * 60 * 24 * 7,
        },
        {
          secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        },
      )
      .catch((err) => {
        console.log();
        throw new BadRequestException(err.message);
      });
  }

  private async signAccessTokenAndRefreshToken(
    payload: TokenPayload,
  ): Promise<ResTokenType> {
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(payload),
      this.signRefreshToken(payload),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async saveFreshTokenToDB(payload: {
    token: string;
    userId: string;
  }): Promise<{
    id: string;
    token: string;
    userId: string;
  }> {
    return await this.prismaService.refreshToken.create({
      data: payload,
    });
  }

  async register(
    payload: RegisterUserDto,
  ): Promise<SuccessResponse<ResTokenType>> {
    const { password, email, firstName, lastName, avatar } = payload;

    const newUser = await this.prismaService.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashPassword(password),
        avatar: avatar ?? AVATAR,
      },
    });

    if (!newUser) {
      throw new BadRequestException('Register failed');
    }

    const { accessToken, refreshToken } =
      await this.signAccessTokenAndRefreshToken({
        userId: newUser.id,
        role: newUser.role,
      });

    await this.saveFreshTokenToDB({
      token: refreshToken,
      userId: newUser.id,
    });

    return {
      message: 'Register successfully',
      data: {
        accessToken,
        refreshToken,
      },
    };
  }

  async login(
    role: string,
    id: string,
  ): Promise<SuccessResponse<ResTokenType>> {
    const { accessToken, refreshToken } =
      await this.signAccessTokenAndRefreshToken({
        userId: id,
        role: role,
      });

    await this.saveFreshTokenToDB({
      token: refreshToken,
      userId: id,
    });

    return {
      message: 'Login successfully',
      data: {
        accessToken,
        refreshToken,
      },
    };
  }

  async logOut({
    refreshTokenId,
    refreshToken,
  }: {
    refreshTokenId: string;
    refreshToken: string;
  }): Promise<SuccessResponse<undefined>> {
    console.log(refreshTokenId);
    await this.prismaService.refreshToken.delete({
      where: {
        id: refreshTokenId,
        token: refreshToken,
      },
    });

    return {
      message: 'Log out successfully',
    };
  }

  async refreshToken({
    refresh_token_id,
    role,
    userId,
    exp,
  }: {
    refresh_token_id: string;
    role: string;
    userId: string;
    exp: string | number;
  }): Promise<SuccessResponse<ResTokenType>> {
    const [newAccesToken, newRefreshToken] = await Promise.all([
      this.signAccessToken({ role, userId }),
      this.signRefreshToken({ role, userId, exp }),
    ]);

    await this.prismaService.refreshToken.update({
      data: {
        token: newRefreshToken,
      },
      where: {
        id: refresh_token_id,
      },
    });

    return {
      message: 'refresh token successfully',
      data: {
        accessToken: newAccesToken,
        refreshToken: newRefreshToken,
      },
    };
  }
}
