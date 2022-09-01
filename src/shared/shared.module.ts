import { Module } from '@nestjs/common'
import { GraylogService } from '@shared/logging/graylog.service'
import { LineNotifyService } from '@shared/line-notify/line-notify.service'
import { RedisCacheModule } from '@shared/redis-cache/redis-cache.module'
import { LocalLoggingService } from '@shared/logging/local-logging.service'

@Module({
  imports: [RedisCacheModule],
  providers: [GraylogService, LineNotifyService, LocalLoggingService],
  exports: [GraylogService, LineNotifyService, LocalLoggingService]
})
export class SharedModule {}
