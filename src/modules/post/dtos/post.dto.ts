import { PartialType } from '@nestjs/swagger';
import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const PostZ = z.object({
  name: z.string(),
  description: z.string(),
  content: z.string(),
  caterogies: z.array(z.string()),
});

export class CreatePostDto extends createZodDto(PostZ) {}
export class UpdatePostDto extends PartialType(CreatePostDto) {}
