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
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { ZodValidationPipe } from '@anatine/zod-nestjs';

import { SuccessResponse } from 'src/common/cores/respone';
import { CategoryService } from '../services';
import { CategoryType } from '../types';
import { RolesSystem } from 'src/modules/auth/enums';
import { CreateCategoryDto } from '../dtos';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('')
  async findAll(): Promise<SuccessResponse<CategoryType[]>> {
    const result = await this.categoryService.findAll();
    return {
      ...result,
    };
  }

  @Post()
  @Roles(RolesSystem.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ZodValidationPipe())
  async create(
    @Body() payload: CreateCategoryDto,
  ): Promise<SuccessResponse<undefined>> {
    const result = await this.categoryService.create(payload);
    return {
      ...result,
    };
  }

  @Patch(':id')
  @Roles(RolesSystem.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ZodValidationPipe())
  async update(
    @Body() payload: CreateCategoryDto,
    @Param('id') id: string,
  ): Promise<SuccessResponse<undefined>> {
    const result = await this.categoryService.update(id, payload);
    return {
      ...result,
    };
  }

  @Delete(':id')
  @Roles(RolesSystem.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ZodValidationPipe())
  async remove(@Param('id') id: string): Promise<SuccessResponse<undefined>> {
    const result = await this.categoryService.remove(id);
    return {
      ...result,
    };
  }
}
