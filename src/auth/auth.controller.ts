import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from './auth.dto';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { AuthGuard } from './auth.guard';
import { User } from './auth.decorator';
import { TokenPayload } from './auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe())
  async register(@Body() registerUserDto: RegisterUserDto) {
    const result = await this.authService.register(registerUserDto);
    return {
      ...result,
    };
  }

  @Post('login')
  @UsePipes(new ZodValidationPipe())
  async login(@Body() loginUserDto: LoginUserDto) {
    const result = await this.authService.login(loginUserDto);
    return {
      ...result,
    };
  }

  @Post('log-out')
  @UseGuards(AuthGuard)
  async logOut(
    @User() user: TokenPayload,
    @Body() { refreshToken }: { refreshToken: string },
  ) {
    const { userId } = user;
    const result = await this.authService.logOut({ userId, refreshToken });
    return {
      ...result,
    };
  }

  @Post('refresh-tokens')
  async handleRefreshToken(@Body() { refreshToken }: { refreshToken: string }) {
    const result = await this.authService.handleRefreshToken(refreshToken);
    // return {
    //   ...result,
    // };
  }
}
