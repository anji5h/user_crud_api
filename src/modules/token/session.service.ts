import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { nanoid } from 'nanoid';

@Injectable()
export class SessionService {
  constructor(private readonly dbService: DatabaseService) {}

  async getSessionsAsync() {
    const sessions = await this.dbService.session.findMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return sessions;
  }

  async createSessionAsync(userId: number, device: string, expiresAt: Date) {
    const id = nanoid(32);
    const session = await this.dbService.session.create({
      data: {
        id,
        userId,
        device,
        expiresAt,
      },
    });

    return session.id;
  }
}
