import {
  LoginMiddleware,
  RefreshTokenMiddleware,
  RegisterMiddleware,
} from './middlewares';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

import { AuthController } from './controllers';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthGuard],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RegisterMiddleware).forRoutes({
      path: 'auth/register',
      method: RequestMethod.POST,
    });
    consumer.apply(LoginMiddleware).forRoutes({
      path: 'auth/login',
      method: RequestMethod.POST,
    });
    consumer.apply(RefreshTokenMiddleware).forRoutes(
      {
        path: 'auth/log-out',
        method: RequestMethod.POST,
      },
      {
        path: 'auth/refresh-token',
        method: RequestMethod.POST,
      },
    );
  }
}
