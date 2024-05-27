import { JwtModule, JwtService } from '@nestjs/jwt';

import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { NoteModule } from './note/note.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

/**
 * We have 2 entries: user and note 1 user have many notes
 */
@Module({
  imports: [
    AuthModule,
    UserModule,
    NoteModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      envFilePath: '.env',
    }),
  ],
})
export class AppModule {}
