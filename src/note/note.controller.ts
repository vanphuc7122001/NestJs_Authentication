import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from 'src/auth/auth.guard';
import { NoteService } from './note.service';
import { CreateNoteDto } from './note.dto';
import { TokenPayload } from 'src/auth/auth.interface';
import { User } from 'src/auth/auth.decorator';

@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  @HttpCode(201 || 400)
  @UseGuards(AuthGuard)
  create(@Body() createNoteDto: CreateNoteDto, @User() user: TokenPayload) {
    const result = this.noteService.create({ createNoteDto, user });
    return {
      ...result,
    };
  }

  //   @Get()
  //   findAll() {
  //     const result = this.noteService.findAll();
  //     return {
  //       ...result,
  //     };
  //   }

  //   @Get(':id')
  //   findOne() {
  //     const result = this.noteService.findOne();
  //     return {
  //       ...result,
  //     };
  //   }
}
