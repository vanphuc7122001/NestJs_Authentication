import { CreateNoteDto } from './note.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenPayload } from 'src/auth/auth.interface';

@Injectable()
export class NoteService {
  constructor(private readonly prismaService: PrismaService) {}
  async create({
    createNoteDto,
    user,
  }: {
    createNoteDto: CreateNoteDto;
    user: TokenPayload;
  }) {
    await this.prismaService.note.create({
      data: {
        ...createNoteDto,
        description: createNoteDto.desctiption,
      },
    });

    return {
      message: 'Create note successfully',
    };
  }
}
