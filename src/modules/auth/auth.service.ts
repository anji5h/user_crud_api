import { Injectable, UnauthorizedException } from '@nestjs/common';
import { loginRequestDto } from './dto/loginRequestDto';
import { HashService } from '../hash/hash.service';
import { DatabaseService } from '../database/database.service';
import { JwtService } from '@nestjs/jwt';
import { nanoid } from 'nanoid';
import { ConfigService } from '@nestjs/config';
import { IEnvConfig } from 'src/common/types/envConfig';
import { TokenService } from '../token/token.service';
import { jwtPayload } from 'src/common/types/jwtPayload';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashService: HashService,
    private readonly dbService: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<IEnvConfig>,
    private readonly tokenService: TokenService,
  ) {}

  async loginAsync(loginDto: loginRequestDto) {
    const user = await this.dbService.user.findUnique({
      where: {
        email: loginDto.email,
      },
      include: {
        role: true,
      },
    });

    if (!user) throw new UnauthorizedException('Invalid email or password');

    const isPasswordVerified = await this.hashService.verifyPassword(
      loginDto.password,
      user.password,
    );

    if (!isPasswordVerified)
      throw new UnauthorizedException('Invalid email or password');

    const { accessToken, refreshToken } = await this.createAuthTokenAsync(
      {
        id: user.id,
        role: user.role.name,
      },
      loginDto.remember,
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
      },
      refreshToken: refreshToken,
      accessToken: accessToken,
    };
  }

  private async createAuthTokenAsync(payload: jwtPayload, remember: boolean) {
    const refreshToken = nanoid(32);

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
    });

    const refreshTokenExpire = remember
      ? new Date(
          Date.now() + this.configService.get('REFRESH_TOKEN_EXPIRE') * 1000,
        )
      : new Date(Date.now() + 86400 * 1000);

    await this.tokenService.saveTokenAsync(
      refreshToken,
      payload.id,
      refreshTokenExpire,
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
