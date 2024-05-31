import { Module } from '@nestjs/common';
import { NoteController } from './controllers';
import { NoteRepository } from './repositories';
import { NoteService } from './services';

@Module({
  controllers: [NoteController],
  imports: [],
  providers: [NoteService, NoteRepository],
})
export class NoteModule {}
