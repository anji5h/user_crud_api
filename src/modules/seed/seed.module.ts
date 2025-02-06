import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { DatabaseModule } from '../database/database.module';
import { ConfigModule } from '@nestjs/config';
import { HashModule } from '../hash/hash.module';

@Module({
  imports: [DatabaseModule, ConfigModule, HashModule],
  providers: [SeedService],
})
export class SeedModule {}
