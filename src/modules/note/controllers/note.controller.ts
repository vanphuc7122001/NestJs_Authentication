import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';

import { AuthGuard } from 'src/modules/auth/guards/auth.guard';

import { User } from 'src/modules/auth/decorators/auth.decorator';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { SuccessResponse } from 'src/common/cores/respone';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { ApiTags } from '@nestjs/swagger';
import { NoteService } from '../services';
import { CreateNoteDto, UpdateNoteDto } from '../dtos';
import { TokenPayload } from 'src/modules/auth/types';
import { RolesSystem } from 'src/modules/auth/enums';
import { NoteType } from '../types';

@ApiTags('Note')
@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  @Roles(RolesSystem.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ZodValidationPipe())
  async create(
    @Body() createNoteDto: CreateNoteDto,
    @User() user: TokenPayload,
  ) {
    const { userId } = user;
    console.log(createNoteDto);
    // return await this.noteService.create(createNoteDto, userId);
  }

  @Patch(':id')
  @Roles(RolesSystem.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ZodValidationPipe())
  async update(
    @Body() updateNoteDto: UpdateNoteDto,
    @Param('id') id: string,
  ): Promise<SuccessResponse<undefined>> {
    return await this.noteService.update({ updateNoteDto, id });
  }

  @Get()
  @Roles(RolesSystem.USER)
  @UseGuards(AuthGuard, RolesGuard)
  async findAll(): Promise<SuccessResponse<NoteType[]>> {
    return await this.noteService.findAll();
  }

  @Get(':id')
  @Roles(RolesSystem.USER)
  @UseGuards(AuthGuard, RolesGuard)
  async findOne(@Param('id') id: string): Promise<SuccessResponse<NoteType>> {
    return await this.noteService.findOne(id);
  }

  @Delete(':id')
  @Roles(RolesSystem.USER)
  @UseGuards(AuthGuard, RolesGuard)
  async remove(@Param('id') id: string): Promise<SuccessResponse<undefined>> {
    return await this.noteService.remove(id);
  }
}
