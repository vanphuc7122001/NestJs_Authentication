import { CreateCategoryDto } from '../dtos';

export type CategoryType = {
  [key in keyof CreateCategoryDto]: string;
} & {
  id: string;
};
