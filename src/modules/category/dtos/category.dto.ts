import { PartialType } from '@nestjs/swagger';
import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const authZ = extendApi(
  z
    .object({
      name: z.string().min(2).max(50),
    })
    .required(),
);

export class CreateCategoryDto extends createZodDto(authZ) {}
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
