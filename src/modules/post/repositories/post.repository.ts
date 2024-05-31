import { DefaultArgs } from '@prisma/client/runtime/library';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/shares/prisma/services';

@Injectable()
export class PostRepository {
  private readonly _model: Prisma.PostDelegate<DefaultArgs>;

  constructor(private readonly _prismaService: PrismaService) {
    this._model = this._prismaService.post;
  }

  async create(data: Prisma.PostCreateInput) {
    return this._model.create({ data });
  }

  async findOne(params: Prisma.PostFindFirstArgs) {
    return this._model.findFirst(params);
  }

  async findOneOrThrow(params: Prisma.PostFindFirstOrThrowArgs) {
    return this._model.findFirstOrThrow(params);
  }

  async findMany(params?: Prisma.PostFindManyArgs) {
    return this._model.findMany(params);
  }

  async count(params: Prisma.PostCountArgs) {
    return this._model.count(params);
  }

  async update(params: Prisma.PostUpdateArgs) {
    return this._model.update(params);
  }

  async delete(where: Prisma.PostWhereUniqueInput) {
    return this._model.delete({ where });
  }
}
