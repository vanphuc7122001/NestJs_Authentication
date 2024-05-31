import { DefaultArgs } from '@prisma/client/runtime/library';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/shares/prisma/services';

@Injectable()
export class NoteRepository {
  private readonly _model: Prisma.NoteDelegate<DefaultArgs>;

  constructor(private readonly _prismaService: PrismaService) {
    this._model = this._prismaService.note;
  }

  async create(data: Prisma.NoteCreateInput) {
    return this._model.create({ data });
  }

  async findOne(params: Prisma.NoteFindFirstArgs) {
    return this._model.findFirst(params);
  }

  async findOneOrThrow(params: Prisma.NoteFindFirstOrThrowArgs) {
    return this._model.findFirstOrThrow(params);
  }

  async findMany(params?: Prisma.NoteFindManyArgs) {
    return this._model.findMany(params);
  }

  async count(params: Prisma.NoteCountArgs) {
    return this._model.count(params);
  }

  async update(params: Prisma.NoteUpdateArgs) {
    return this._model.update(params);
  }

  async delete(where: Prisma.NoteWhereUniqueInput) {
    return this._model.delete({ where });
  }
}
