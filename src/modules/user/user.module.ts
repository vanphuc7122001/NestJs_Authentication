import { Module } from '@nestjs/common';
import { UserController } from './controllers';
import { UserRepository } from './repositories';
import { UserService } from './services';

@Module({
  controllers: [UserController],
  providers: [UserRepository, UserService],
})
export class UserModule {}
