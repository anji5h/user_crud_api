import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class TokenService {
  constructor(private readonly dbService: DatabaseService) {}

  async saveTokenAsync(token: string, userId: number, expiresAt: Date) {
    await this.dbService.token.create({
      data: {
        token,
        userId,
        expiresAt: expiresAt,
      },
    });
  }

  async getTokenAsync(token: string) {
    const refreshToken = await this.dbService.token.findUnique({
      where: {
        token: token,
      },
    });

    return refreshToken;
  }
}
