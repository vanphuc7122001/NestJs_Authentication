import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { NoteModule } from './note/note.module';

/**
 * We have 2 entries: user and note 1 user have many notes
 */
@Module({
  imports: [AuthModule, UserModule, NoteModule],
})
export class AppModule {}
