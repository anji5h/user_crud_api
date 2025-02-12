import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { LoginRequestDto } from './dto/login-request.dto';
import { AuthService } from './auth.service';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { LoginResponseDto } from './dto/login-response.dto';
import { CookieOptions, Response } from 'express';
import { RegisterRequestDto } from './dto/register-request.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { UAParser } from 'ua-parser-js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginRequestDto })
  @ApiResponse({ type: LoginResponseDto })
  async login(
    @Body() loginDto: LoginRequestDto,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const userAgent = UAParser(request.headers['user-agent']);

    const { user, token, sessionId, sessionExpiresAt } =
      await this.authService.loginAsync(loginDto, userAgent);

    const cookieOptions: CookieOptions = loginDto.remember
      ? { expires: sessionExpiresAt, httpOnly: true }
      : { httpOnly: true };

    return response.cookie('session_id', sessionId, cookieOptions).json({
      statusCode: HttpStatus.OK,
      message: 'SUCCESS',
      data: { user, token: token },
    });
  }

  @Post('register')
  @HttpCode(200)
  @ApiBody({ type: RegisterRequestDto })
  @ApiResponse({ type: RegisterResponseDto })
  async registerAsync(@Body() registerDto: RegisterRequestDto) {
    await this.authService.registerAsync(registerDto);

    const response = new RegisterResponseDto();
    response.statusCode = 201;
    response.message = 'SUCCESS';
  }
}
