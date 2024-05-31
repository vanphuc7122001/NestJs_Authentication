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
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { User } from 'src/modules/auth/decorators/auth.decorator';
import { PostService } from '../services';
import { CreatePostDto, UpdatePostDto } from '../dtos';
import { TokenPayload } from 'src/modules/auth/types';

// TODO Chua test
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(ZodValidationPipe)
  async create(@Body() payload: CreatePostDto, @User() user: TokenPayload) {
    return await this.postService.create(payload, user.userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.postService.findOne(id);
  }

  @Get('')
  async findAll() {
    return await this.postService.findAll();
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @UsePipes(ZodValidationPipe)
  async update(@Body() payload: UpdatePostDto, @Param('id') id: string) {
    return await this.postService.update(payload, id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string) {
    return await this.postService.remove(id);
  }
}
