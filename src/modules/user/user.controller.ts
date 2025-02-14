import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import {
  UserCreateRequestDto,
  UserCreateResponseDto,
} from './dto/user-create.dto';
import { UserService } from './user.service';
import { Public } from 'src/common/decorators/public.decorator';
import { Request } from 'express';
import {
  UserVerifyRepsonseDto,
  UserVerifyRequestDto,
  VerifyEmailRepsonseDto,
} from './dto/user-verify.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('create')
  @HttpCode(201)
  @ApiBody({ type: UserCreateRequestDto })
  @ApiResponse({ type: UserCreateResponseDto })
  async createAsync(@Body() userCreateDto: UserCreateRequestDto) {
    await this.userService.createUserAsync(userCreateDto);

    const response = new UserCreateResponseDto();
    response.statusCode = 201;
    response.message = 'SUCCESS';

    return response;
  }

  @Get('verify')
  @ApiResponse({
    type: VerifyEmailRepsonseDto,
  })
  async sendVerificationMailAsync(@Req() request: Request) {
    await this.userService.sendVerificationMailAsync(request.user.userId);

    const response = new VerifyEmailRepsonseDto();
    response.statusCode = 204;
    response.message = 'VERIFICATION MAIL SENT';

    return response;
  }

  @Patch('verify')
  @ApiBody({
    type: UserVerifyRequestDto,
  })
  @ApiResponse({
    type: UserVerifyRepsonseDto,
  })
  async verifyUserAsync(
    @Body() body: UserVerifyRequestDto,
    @Req() request: Request,
  ) {
    await this.userService.verifyUserAsync(request.user.userId, body.otp);

    const response = new UserVerifyRepsonseDto();
    response.statusCode = 204;
    response.message = 'USER VERIFIED';

    return response;
  }
}
