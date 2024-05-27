import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const NoteZ = extendApi(
  z.object({
    title: z.string(),
    desctiption: z.string(),
  }),
  {
    title: 'Note',
    description: 'A note',
  },
);
export class CreateNoteDto extends createZodDto(NoteZ) {}
