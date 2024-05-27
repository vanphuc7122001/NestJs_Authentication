import { PickType } from '@nestjs/mapped-types';
import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const authZ = extendApi(
  z
    .object({
      email: z.string().email().min(2).max(50),
      password: z.string().min(2).max(50),
      avatar: z.string().optional(),
      firstName: z.string().min(2).max(100),
      lastName: z.string().min(2).max(100),
      confirmPassword: z.string().min(2).max(100),
    })
    .strict()
    .superRefine(({ confirmPassword, password }, ctx) => {
      if (confirmPassword !== password) {
        ctx.addIssue({
          code: 'custom',
          message: 'Password does not match',
          path: ['confirmPassword'],
        });
      }
    }),
  {
    title: 'User',
    description: 'Account user',
  },
);

export class RegisterUserDto extends createZodDto(authZ) {}
export class LoginUserDto extends PickType(RegisterUserDto, [
  'email',
  'password',
] as const) {}
