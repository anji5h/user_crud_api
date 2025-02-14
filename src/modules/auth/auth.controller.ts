import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import { UAParser } from 'ua-parser-js';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { request } from 'http';
import { TokenResponseDto } from './dto/token-response.dto';

@Public()
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

    return response
      .cookie('session_id', sessionId, {
        expires: sessionExpiresAt,
        httpOnly: true,
      })
      .json({
        statusCode: HttpStatus.OK,
        message: 'SUCCESS',
        data: { user, token: token },
      });
  }

  @Get('token')
  @ApiResponse({
    type: TokenResponseDto,
  })
  async refreshJwtTokenAsync(@Req() request: Request) {
    const token = await this.authService.refreshJwtTokenAsync(
      request.cookies['session_id'],
    );

    const response = new TokenResponseDto();
    response.message = 'SUCCESS';
    response.statusCode = 200;
    response.data.token = token;

    return token;
  }
}
