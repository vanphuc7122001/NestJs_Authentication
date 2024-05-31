import { Module } from '@nestjs/common';
import { PostController } from './controllers';
import { PostRepository } from './repositories';
import { PostService } from './services';

@Module({
  providers: [PostService, PostRepository],
  controllers: [PostController],
})
export class PostModule {}
