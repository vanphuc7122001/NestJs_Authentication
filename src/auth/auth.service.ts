import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { LoginUserDto, RegisterUserDto } from './auth.dto';

import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenPayload } from './auth.interface';
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

  private async signAccessToken(payload: TokenPayload) {
    return await this.jwtService.sign(payload, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      expiresIn: '1h', // access token hết hạn sau 15 phút
    });
  }

  private async saveRefreshTokenToDB({
    refreshToken,
    userId,
  }: {
    refreshToken: string;
    userId: string;
  }) {
    return await this.prismaService.refreshToken.create({
      data: {
        refresh_token: refreshToken,
        user_id: userId,
      },
    });
  }

  private async signRefreshToken(payload: TokenPayload) {
    return await this.jwtService.sign(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: '7d', // refresh token hết hạn sau 7 ngày
    });
  }

  private async signAccessTokenAndRefreshToken(payload: TokenPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(payload),
      this.signRefreshToken(payload),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async verifyToken({
    token,
    secret,
  }: {
    token: string;
    secret: string;
  }): Promise<TokenPayload> {
    return await this.jwtService.verifyAsync(token, { secret });
  }

  async register(payload: RegisterUserDto) {
    const { password, email, firstName, lastName, avatar } = payload;

    const foundUser = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });

    if (foundUser) {
      throw new BadRequestException('User already exists');
    }

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

    return {
      message: 'Register successfully',
    };
  }

  async login(payload: LoginUserDto) {
    const { email, password } = payload;

    const foundUser = await this.prismaService.user.findFirst({
      where: {
        email,
        password: hashPassword(password),
      },
    });

    if (!foundUser) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const tokens = await this.signAccessTokenAndRefreshToken({
      userId: foundUser.id,
    });

    const newRefreshToken = await this.saveRefreshTokenToDB({
      refreshToken: tokens.refreshToken,
      userId: foundUser.id,
    });

    if (!newRefreshToken) {
      throw new BadRequestException('U was login');
    }

    return {
      message: 'Login successful',
      data: { tokens },
    };
  }

  async logOut({
    userId,
    refreshToken,
  }: {
    userId: string;
    refreshToken: string;
  }) {
    console.log(refreshToken);
    if (!refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }

    let foundRefreshToken, _;

    try {
      [_, foundRefreshToken] = await Promise.all([
        this.verifyToken({
          token: refreshToken,
          secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        }),
        this.prismaService.refreshToken.findFirst({
          where: {
            refresh_token: refreshToken,
            user_id: userId,
          },
        }),
      ]);

      if (!foundRefreshToken) {
        throw new UnauthorizedException('Used refresh token or not exist');
      }
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException(error.message);
      }
      throw error;
    }

    await this.prismaService.refreshToken.delete({
      where: {
        id: foundRefreshToken.id,
      },
    });

    return {
      message: 'Log out successfully',
    };
  }

  async handleRefreshToken(refreshToken: string) {
    const [checkTokenExistsInRefreshTokenUsed, foundRefreshToken] =
      await Promise.all([
        this.prismaService.refreshTokenUsed.findFirst({
          where: {
            token: refreshToken,
          },
        }),
        this.prismaService.refreshToken.findFirst({
          where: {
            refresh_token: refreshToken,
          },
        }),
      ]);

    if (!foundRefreshToken) {
      throw new BadRequestException('Token not found or token is incorrect');
    }

    if (checkTokenExistsInRefreshTokenUsed) {
      // remove token
      await this.prismaService.refreshToken.delete({
        where: {
          id: foundRefreshToken.id as string,
        },
      });
    }

    const verifyRefreshToken: TokenPayload = await this.verifyToken({
      token: refreshToken,
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
    });

    if (!verifyRefreshToken) {
      throw new UnauthorizedException('Token invalid');
    }

    const tokens = await this.signAccessTokenAndRefreshToken({
      userId: verifyRefreshToken.userId,
    });

    // add refresh token into list used
    await Promise.all([
      this.prismaService.refreshTokenUsed.create({
        data: {
          token: refreshToken,
        },
      }),
      this.prismaService.refreshToken.update({
        where: {
          user_id: verifyRefreshToken.userId,
        },
        data: {
          refresh_token: tokens.refreshToken,
        },
      }),
    ]);

    return {
      message: 'refresh token successfully',
      ...tokens,
    };
  }
}
