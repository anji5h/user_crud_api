import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { nanoid } from 'nanoid';
import { ConfigService } from '@nestjs/config';
import { IConfig } from 'src/common/types/config.type';
import { jwtPayload } from 'src/common/types/jwt-payload.type';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SessionService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly configService: ConfigService<IConfig>,
    private readonly jwtService: JwtService,
  ) {}

  async getTokenAsync(sessionId: string) {
    const refreshToken = await this.dbService.session.findUnique({
      where: {
        id: sessionId,
      },
      include: {
        user: true,
      },
    });

    return refreshToken;
  }

  async createTokenAsync(
    payload: jwtPayload,
    device: string,
    remember: boolean,
  ) {
    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
    });

    const sessionExpiresAt = remember
      ? new Date(
          Date.now() + this.configService.get('REFRESH_TOKEN_EXPIRE') * 1000,
        )
      : new Date(Date.now() + 86400 * 1000);

    await this.dbService.session.create({
      data: {
        id: payload.sessionId,
        userId: payload.userId,
        device,
        expiresAt: sessionExpiresAt,
      },
    });

    return {
      sessionId: payload.sessionId,
      sessionExpiresAt,
      token,
    };
  }
}
