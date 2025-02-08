import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { loginRequestDto } from './dto/loginRequestDto';
import { AuthService } from './auth.service';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { loginResponseDto } from './dto/loginResponseDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiBody({
    type: loginRequestDto,
  })
  @ApiResponse({
    type: loginResponseDto,
  })
  async login(@Body() requestDto: loginRequestDto): Promise<loginResponseDto> {
    const response = await this.authService.login(requestDto);
    return response;
  }
}
