import { Injectable, NotFoundException } from '@nestjs/common';

import { CategoryRepository } from '../repositories';
import { CreateCategoryDto } from '../dtos';
import { PrismaService } from 'src/shares/prisma/services';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}
  async create(data: CreateCategoryDto) {
    await this.categoryRepository.create({
      name: data.name as string,
    });

    return {
      message: 'Created category successfully',
    };
  }

  async findAll() {
    return {
      message: 'find all successfully',
      data: await this.categoryRepository.findMany({
        select: {
          id: true,
          name: true,
        },
      }),
    };
  }

  async update(id: string, data: CreateCategoryDto) {
    await Promise.all([
      this.categoryRepository
        .findOneOrThrow({
          where: {
            id,
          },
        })
        .catch(() => {
          throw new NotFoundException(`Can not find category with id =  ${id}`);
        }),
      this.categoryRepository.update({
        data: {
          name: data.name as string,
        },
        where: {
          id,
        },
      }),
    ]);

    return {
      message: 'Update category successfully',
    };
  }

  async remove(id: string) {
    await Promise.all([
      this.categoryRepository
        .findOneOrThrow({
          where: {
            id,
          },
        })
        .catch(() => {
          throw new NotFoundException(`Can not find category with id =  ${id}`);
        }),
      this.categoryRepository.delete({
        id,
      }),
    ]);

    return {
      message: 'Delete category successfully',
    };
  }
}
