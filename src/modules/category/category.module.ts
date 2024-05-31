import { CategoryController } from './controllers';
import { CategoryRepository } from './repositories';
import { CategoryService } from './services';
import { Module } from '@nestjs/common';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
})
export class CategoryModule {}
