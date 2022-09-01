import { Module } from '@nestjs/common'
import { IndexController } from '@app/index/index.controller'
import { IndexService } from '@services/index/index.service'

@Module({
  controllers: [IndexController],
  providers: [IndexService]
})
export class IndexModule {}
