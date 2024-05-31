import { DefaultArgs } from '@prisma/client/runtime/library';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/shares/prisma/services';

@Injectable()
export class CategoryRepository {
  private readonly _model: Prisma.CaterogyDelegate<DefaultArgs>;

  constructor(private readonly _prismaService: PrismaService) {
    this._model = this._prismaService.caterogy;
  }

  async create(data: Prisma.CaterogyCreateInput) {
    return this._model.create({ data });
  }

  async findOne(params: Prisma.CaterogyFindFirstArgs) {
    return this._model.findFirst(params);
  }

  async findOneOrThrow(params: Prisma.CaterogyFindFirstOrThrowArgs) {
    return this._model.findFirstOrThrow(params);
  }

  async findMany(params?: Prisma.CaterogyFindManyArgs) {
    return this._model.findMany(params);
  }

  async count(params: Prisma.CaterogyCountArgs) {
    return this._model.count(params);
  }

  async update(params: Prisma.CaterogyUpdateArgs) {
    return this._model.update(params);
  }

  async delete(where: Prisma.CaterogyWhereUniqueInput) {
    return this._model.delete({ where });
  }
}
