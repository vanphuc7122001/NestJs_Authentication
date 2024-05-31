import { CreatePostDto, UpdatePostDto } from '../dtos';
import { Injectable, NotFoundException } from '@nestjs/common';

import { PostRepository } from '../repositories';
import { PrismaService } from 'src/shares/prisma/services';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async create(data: CreatePostDto, userId) {
    await this.postRepository.create({
      content: data.content,
      description: data.description,
      name: data.name,
      caterogies: {
        connect: data.caterogies.map((item) => ({
          id: (item as any).id,
        })),
      },
      User: {
        connect: {
          id: userId,
        },
      },
    });

    return {
      message: 'Create post successfully',
    };
  }

  async findOne(id: string) {
    const result = await this.postRepository
      .findOneOrThrow({
        where: {
          id,
        },
      })
      .catch(() => {
        throw new NotFoundException(`Can not find post with id = ${id}`);
      });

    return {
      message: 'Get detail post successfully',
      data: result,
    };
  }

  async findAll() {
    const result = await this.postRepository.findMany();

    return {
      message: 'Get all post successfully',
      data: result,
    };
  }

  async update(data: UpdatePostDto, id) {
    await Promise.all([
      this.postRepository.update({
        data: {
          content: data.content,
          description: data.description,
          name: data.name,
          caterogies: {
            connect: data.caterogies.map((item) => ({
              id: (item as any).id,
            })),
          },
        },
        where: {
          id,
        },
      }),
      this.postRepository
        .findOneOrThrow({
          where: {
            id,
          },
        })
        .catch(() => {
          throw new NotFoundException(`Can not find post with id =  ${id}`);
        }),
    ]);
    return {
      message: 'Update post successfull',
    };
  }

  async remove(id: string) {
    await Promise.all([
      this.postRepository
        .findOneOrThrow({
          where: {
            id,
          },
        })
        .catch(() => {
          throw new NotFoundException(`Can not find post with id = ${id}`);
        }),
      this.postRepository.update({
        where: {
          id,
        },
        data: {},
      }),
    ]);

    return {
      message: 'Remove post successfull',
    };
  }
}
