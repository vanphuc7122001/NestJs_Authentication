import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';

import { ZodValidationPipe } from '@anatine/zod-nestjs';

import { SuccessResponse } from 'src/common/cores/respone';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services';
import { RegisterUserDto } from '../dtos';
import { TokenPayload, ResTokenType, UserType } from '../types';
import { RefreshToken, User } from '../decorators';
import { AuthGuard } from '../guards';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe())
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<SuccessResponse<ResTokenType>> {
    return await this.authService.register(registerUserDto);
  }

  @Post('login')
  @UsePipes(new ZodValidationPipe())
  async login(@User() user: UserType): Promise<SuccessResponse<ResTokenType>> {
    const { role, id } = user;
    return await this.authService.login(role, id);
  }

  @Post('log-out')
  @UseGuards(AuthGuard)
  async logOut(
    @RefreshToken() decodedRefreshToken: TokenPayload,
    @Body() { refreshToken }: { refreshToken: string },
  ) {
    const { refresh_token_id } = decodedRefreshToken;

    return await this.authService.logOut({
      refreshTokenId: refresh_token_id,
      refreshToken,
    });
  }

  @Post('refresh-token')
  async refreshToken(
    @RefreshToken() decodedRefreshToken: TokenPayload,
  ): Promise<SuccessResponse<ResTokenType>> {
    console.log('running refresh token');
    const { refresh_token_id, role, userId, exp } = decodedRefreshToken;

    return await this.authService.refreshToken({
      refresh_token_id,
      role,
      userId,
      exp,
    });
  }
}
