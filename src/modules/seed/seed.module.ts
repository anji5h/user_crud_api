import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { DatabaseModule } from '../database/database.module';
import { HashModule } from '../hash/hash.module';

@Module({
  imports: [DatabaseModule, HashModule],
  providers: [SeedService],
})
export class SeedModule {}
