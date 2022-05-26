import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
    constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

    async get(key): Promise<any> {
        return await this.cache.get(key);
    }

    async set(key, value) {
        let ttl = 0;
        if(key.split("-")[0] == 'priceAction') ttl = 172800; // override default ttl from 24 to 48 hrs
        await this.cache.set(key, value, ttl);
        console.log('DATA SET', {key});
    }

    async reset() {
        await this.cache.reset();
    }

    async del(key) {
        await this.cache.del(key);
    }
}
