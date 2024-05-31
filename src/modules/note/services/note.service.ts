import { CreateNoteDto, UpdateNoteDto } from '../dtos';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

import { CacheKey } from '@nestjs/cache-manager';
import { NoteRepository } from '../repositories';
import { NoteType } from '../types';
import { PrismaService } from 'src/shares/prisma/services';
import { SuccessResponse } from 'src/common/cores/respone';

// TODO Co stuck
@Injectable()
export class NoteService {
  constructor(private readonly noteRepository: NoteRepository) {}
  async create(data: CreateNoteDto, userId: string) {
    await this.noteRepository.create({
      description: data.description as string,
      title: data.title as string,
      User: {
        connect: {
          id: userId,
        },
      },
    });

    return {
      message: 'Create note successfully',
    };
  }

  async update({
    updateNoteDto,
    id,
  }: {
    updateNoteDto: UpdateNoteDto;
    id: string;
  }): Promise<SuccessResponse<undefined>> {
    console.log('update note dto', updateNoteDto);
    await Promise.all([
      this.noteRepository
        .findOneOrThrow({
          where: {
            id,
          },
        })
        .catch(() => {
          throw new NotFoundException(`Can not find note with id ${id}`);
        }),
      this.noteRepository.update({
        data: {
          ...updateNoteDto,
        },
        where: {
          id,
        },
      }),
    ]);

    return {
      message: 'Update note successfully',
    };
  }

  @CacheKey('notes')
  async findAll(): Promise<SuccessResponse<NoteType[]>> {
    const result = await this.noteRepository.findMany();
    return {
      message: 'Get all notes successfully',
      data: [...result],
    };
  }

  async findOne(id: string): Promise<SuccessResponse<NoteType>> {
    const result = await this.noteRepository
      .findOneOrThrow({
        where: {
          id,
        },
      })
      .catch(() => {
        throw new NotFoundException(`Can not find not with id = ${id}`);
      });

    return {
      message: 'Get note detail successfully',
      data: result,
    };
  }

  async remove(id: string): Promise<SuccessResponse<undefined>> {
    await Promise.all([
      this.noteRepository
        .findOneOrThrow({
          where: {
            id,
          },
        })
        .catch(() => {
          throw new NotFoundException(`Can not find not with id = ${id}`);
        }),

      this.noteRepository.delete({ id }),
    ]);

    return {
      message: 'Delete note successfully',
    };
  }
}
