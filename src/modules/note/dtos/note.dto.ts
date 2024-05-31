import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const CreateNoteZ = extendApi(
  z.object({
    title: z.string(),
    description: z.string(),
  }),
  {
    title: 'Note',
    description: 'A note',
  },
);

export class CreateNoteDto extends createZodDto(CreateNoteZ) {}
export class UpdateNoteDto extends createZodDto(
  CreateNoteZ.pick({ description: true, title: true }),
) {}
