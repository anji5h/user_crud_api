import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginRequestDto } from './dto/login-request.dto';
import { HashService } from '../hash/hash.service';
import { DatabaseService } from '../database/database.service';
import { SessionService } from '../token/session.service';
import { RegisterRequestDto } from './dto/register-request.dto';
import { nanoid } from 'nanoid';
import UAParser from 'ua-parser-js';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashService: HashService,
    private readonly dbService: DatabaseService,
    private readonly sessionService: SessionService,
  ) {}

  async registerAsync(registerDto: RegisterRequestDto) {
    const hashedPassword = await this.hashService.hashPassword(
      registerDto.password,
    );
    await this.dbService.user.create({
      data: {
        name: registerDto.name,
        password: hashedPassword,
        email: registerDto.email,
        roleId: 1,
      },
    });
  }

  async loginAsync(loginDto: LoginRequestDto, userAgent: UAParser.IResult) {
    const user = await this.dbService.user.findUnique({
      where: {
        email: loginDto.email,
      },
      include: {
        role: true,
      },
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

    const userDevice = `${userAgent.device?.model || userAgent.os?.name || 'unknown'}|${userAgent.browser?.name}`;

    const { sessionId, sessionExpiresAt, token } =
      await this.sessionService.createTokenAsync(
        {
          userId: user.id,
          userRole: user.role.name,
          sessionId: nanoid(32),
        },
        userDevice,
        loginDto.remember,
      );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
      },
      token,
      sessionId,
      sessionExpiresAt,
    };
  }
}
