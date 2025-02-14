import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { nanoid } from 'nanoid';

@Injectable()
export class SessionService {
  constructor(private readonly dbService: DatabaseService) {}

  async getSessionAsync(id: string) {
    const session = await this.dbService.session.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            id: true,
            roleId: true,
          },
          include: {
            role: true,
          },
        },
      },
    });

    return session;
  }

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
    const session = await this.dbService.session.upsert({
      where: {
        userId_device: {
          userId,
          device,
        },
      },
      update: {
        id,
        expiresAt,
      },
      create: {
        id,
        userId,
        device,
        expiresAt,
      },
    });

    return session.id;
  }

  async deleteSessionAsync(id: string) {
    await this.dbService.session.delete({
      where: {
        id,
      },
    });
  }
}
