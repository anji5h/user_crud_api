import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HashService } from 'src/modules/hash/hash.service';
import { DatabaseService } from '../database/database.service';
import { IConfig } from 'src/common/types/config.type';

@Injectable()
export class SeedService {
  private readonly logger = new Logger('SeedService');

  constructor(
    private readonly dbService: DatabaseService,
    private readonly configService: ConfigService<IConfig>,
    private readonly hashService: HashService,
  ) {}

  async run() {
    await this.dbService.role.createMany({
      data: [{ name: 'admin' }, { name: 'user' }],
      skipDuplicates: true,
    });

    const adminRole = await this.dbService.role.findUnique({
      where: {
        name: 'admin',
      },
    });

    if (!adminRole) return;

    const adminUser = await this.dbService.user.findFirst({
      where: {
        roleId: adminRole?.id,
      },
    });

    if (!!adminUser) return;

    const hashedPassword = await this.hashService.hashPassword(
      this.configService.get<string>('ADMIN_PASSWORD') ?? '',
    );

    await this.dbService.user.create({
      data: {
        name: this.configService.get<string>('ADMIN_NAME') ?? '',
        email: this.configService.get<string>('ADMIN_EMAIL') ?? '',
        password: hashedPassword,
        roleId: adminRole?.id,
        verifiedAt: new Date(),
      },
    });

    this.logger.verbose('Database seeded.');
  }
}
