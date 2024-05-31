import { Controller, Post } from '@nestjs/common';

@Controller('users')
export class UserController {
  @Post('update-profile')
  async updateProfile() {
    return '';
  }
}
