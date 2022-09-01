import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common'
import { Cache, CachingConfig, WrapArgsType } from 'cache-manager'

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get<T>(key: string): Promise<T> {
    return await this.cache.get<T>(key)
  }

  async wrap<T>(...args: WrapArgsType<T>[]): Promise<T> {
    return await this.cache.wrap(...args)
  }

  async set<T>(key: string, value: T, options?: CachingConfig): Promise<void> {
    await this.cache.set<T>(key, value, options)
  }

  async del(key: string): Promise<boolean> {
    return !!(await this.cache.del(key))
  }
}
