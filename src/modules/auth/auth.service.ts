import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IConfig } from 'src/common/types/config.type';
import { IJwtPayload } from 'src/common/types/jwt-payload.type';
import { IResult } from 'ua-parser-js';
import { HashService } from '../hash/hash.service';
import { SessionService } from '../session/session.service';
import { UserService } from '../user/user.service';
import { LoginRequestDto } from './dto/login-request.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashService: HashService,
    private readonly sessionService: SessionService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<IConfig>,
    private readonly userService: UserService,
  ) {}

  async loginAsync(loginDto: LoginRequestDto, userAgent: IResult) {
    const user = await this.userService.getUserAsync({
      email: loginDto.email,
    });

    if (!user) throw new UnauthorizedException('Invalid email or password');

    if (user.isBanned)
      throw new ForbiddenException(
        'Your account is suspended. Please contact the admin.',
      );

    const isPasswordVerified = await this.hashService.verifyPassword(
      loginDto.password,
      user.password,
    );

    if (!isPasswordVerified)
      throw new UnauthorizedException('Invalid email or password');

    const userDevice = this.getUserDevice(userAgent);

    const sessionExpiresAt = loginDto.remember
      ? new Date(Date.now() + this.configService.get('SESSION_EXPIRE') * 1000)
      : new Date(Date.now() + 86400 * 1000);

    const sessionId = await this.sessionService.createSessionAsync(
      user.id,
      userDevice,
      sessionExpiresAt,
    );

    const token = await this.createJwtTokenAsync({
      userId: user.id,
      userRole: user.role.name,
      sessionId,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
        isVerified: !!user.verifiedAt,
      },
      token,
      sessionId,
      sessionExpiresAt,
    };
  }

  async refreshJwtTokenAsync(sessionId: string) {
    const session = await this.sessionService.getSessionAsync(sessionId);

    if (!session) {
      throw new UnauthorizedException(
        'TOKEN_REFRESH_FAILED: SESSION NOT FOUND',
      );
    }

    if (session.expiresAt < new Date()) {
      throw new UnauthorizedException('TOKEN_REFRESH_FAILED: SESSION EXPIRED');
    }

    const token = await this.createJwtTokenAsync({
      userId: session.userId,
      sessionId: session.id,
      userRole: session.user.role.name,
    });

    return token;
  }

  private async createJwtTokenAsync(payload: IJwtPayload) {
    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('TOKEN_SECRET'),
    });

    return token;
  }

  private getUserDevice(userAgent: IResult) {
    return `${userAgent.device?.model || userAgent.os?.name || 'unknown'}|${userAgent.browser?.name}`;
  }
}
