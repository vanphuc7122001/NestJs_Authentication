import { DefaultArgs } from '@prisma/client/runtime/library';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/shares/prisma/services';

@Injectable()
export class UserRepository {
  private readonly _model: Prisma.UserDelegate<DefaultArgs>;

  constructor(private readonly _prismaService: PrismaService) {
    this._model = this._prismaService.user;
  }

  async create(data: Prisma.UserCreateInput) {
    return this._model.create({ data });
  }

  async findOne(params: Prisma.UserFindFirstArgs) {
    return this._model.findFirst(params);
  }

  async findOneOrThrow(params: Prisma.UserFindFirstOrThrowArgs) {
    return this._model.findFirstOrThrow(params);
  }

  async findMany(params: Prisma.UserFindManyArgs) {
    return this._model.findMany(params);
  }

  async count(params: Prisma.UserCountArgs) {
    return this._model.count(params);
  }

  async update(params: Prisma.UserUpdateArgs) {
    return this._model.update(params);
  }

  async delete(where: Prisma.UserWhereUniqueInput) {
    return this._model.delete({ where });
  }
}
