import { JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';

@Module({
  controllers: [NoteController],
  imports: [],
  providers: [JwtService, NoteService],
})
export class NoteModule {}
