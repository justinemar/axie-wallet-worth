import { Module } from '@nestjs/common';
import { QueriesService } from './queries.service';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@redis/cache/cache.module';

@Module({
  imports: [
    HttpModule,
    CacheModule
  ],
  providers: [QueriesService],
  exports: [QueriesService],
})
export class QueriesModule {}
