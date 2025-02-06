import { Controller, Post, Request } from '@nestjs/common';
import { loginRequestDto } from './dto/loginRequestDto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(@Request() request: loginRequestDto) {

  }
}
