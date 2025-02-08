import { Injectable, UnauthorizedException } from '@nestjs/common';
import { loginRequestDto } from './dto/loginRequestDto';
import { HashService } from '../hash/hash.service';
import { DatabaseService } from '../database/database.service';
import { responseDto } from 'src/common/dto/responseDto';
import { loginResponseDto } from './dto/loginResponseDto';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashService: HashService,
    private readonly dbService: DatabaseService,
  ) {}

  async login(requestDto: loginRequestDto) {
    const user = await this.dbService.user.findUnique({
      where: {
        email: requestDto.email,
      },
      include: {
        role: true,
      },
    });

    if (!user) throw new UnauthorizedException('Invalid email or password');

    const isPasswordVerified = await this.hashService.verifyPassword(
      requestDto.password,
      user.password,
    );

    if (!isPasswordVerified)
      throw new UnauthorizedException('Invalid email or password');

    const response = new loginResponseDto();
    response.message = 'success';
    response.statusCode = 200;
    response.data = {
      user: {
        name: user.name,
        email: user.email,
        role: user.role.name,
      },
      refreshToken: '',
      accessToken: '',
    };

    return response;
  }
}
