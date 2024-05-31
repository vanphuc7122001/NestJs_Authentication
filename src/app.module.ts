/* eslint-disable @typescript-eslint/ban-ts-comment */

import { AuthModule } from './modules/auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import { CategoryModule } from './modules/category/category.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MediaModule } from './modules/medias/media.module';
import { Module } from '@nestjs/common';
import { NoteModule } from './modules/note/note.module';
import { PrismaModule } from './shares/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { redisStore } from 'cache-manager-redis-store';

/**
 * We have 2 entries: user and note 1 user have many notes
 */
@Module({
  imports: [
    AuthModule,
    UserModule,
    NoteModule,
    CategoryModule,
    PrismaModule,
    MediaModule,
    JwtModule.register({ global: true }),
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      envFilePath: '.env',
    }),
    CacheModule.register({
      // @ts-expect-error
      store: async () =>
        await redisStore({
          // Store-specific configuration:
          socket: {
            host: 'localhost',
            port: 6379,
          },
        }),
      ttl: 60 * 60,
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
