import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { loginRequestDto } from './dto/login-request.dto';
import { AuthService } from './auth.service';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { loginResponseDto } from './dto/login-response.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    type: loginRequestDto,
  })
  @ApiResponse({
    type: loginResponseDto,
  })
  async login(@Body() requestDto: loginRequestDto, @Res() response: Response) {
    const payload = await this.authService.loginAsync(requestDto);

    const reply = new loginResponseDto();
    reply.statusCode = HttpStatus.OK;
    reply.message = 'success';
    reply.data = {
      user: payload.user,
      token: payload.accessToken,
    };

    return response.json(reply).cookie('refresh_token', payload.refreshToken, {
      httpOnly: true,
      
    });
  }
}
