import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IConfig } from 'src/common/types/config.type';
import { IJwtPayload } from 'src/common/types/jwt-payload.type';
import { IResult } from 'ua-parser-js';
import { DatabaseService } from '../database/database.service';
import { HashService } from '../hash/hash.service';
import { RoleService } from '../role/role.service';
import { SessionService } from '../session/session.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { RegisterRequestDto } from './dto/register-request.dto';
import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashService: HashService,
    private readonly dbService: DatabaseService,
    private readonly sessionService: SessionService,
    private readonly roleService: RoleService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<IConfig>,
    private readonly mailerService: MailerService,
  ) {}

  async registerAsync(registerDto: RegisterRequestDto) {
    const hashedPassword = await this.hashService.hashPassword(
      registerDto.password,
    );

    const userRole = await this.roleService.getRoleAsync('user');

    if (!userRole) throw new BadRequestException('REGISTRATION FAILED');

    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpireAt = new Date(
      Date.now() + this.configService.get('OTP_EXPIRE') * 1000,
    );

    const user = await this.dbService.user.create({
      data: {
        name: registerDto.name,
        password: hashedPassword,
        email: registerDto.email,
        roleId: userRole?.id,
        otp,
        otpExpireAt,
      },
    });

    await this.mailerService.sendVerificationMailAsync(
      user.name,
      user.email,
      otp,
    );
  }

  async loginAsync(loginDto: LoginRequestDto, userAgent: IResult) {
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
