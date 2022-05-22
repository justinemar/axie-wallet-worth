import { Module } from '@nestjs/common';
import { QueriesService } from './queries.service';
import { CacheModule } from '@redis/cache/cache.module';

@Module({
  imports: [
    CacheModule
  ],
  providers: [QueriesService],
  exports: [QueriesService],
})
export class QueriesModule {}
