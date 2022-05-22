
import { CacheService } from './cache.service';
import { CacheModule as CacheModuleNest, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
@Module({
  providers: [CacheService],
  exports: [CacheService],
  imports: [
    CacheModuleNest.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
            store: redisStore,
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
            password: configService.get('REDIS_PASSWORD'),
            ttl: configService.get('CACHE_TTL'),
        })
    })
]
})
export class CacheModule {}
