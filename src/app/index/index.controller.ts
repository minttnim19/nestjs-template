import { Controller, Get, HttpCode } from '@nestjs/common'
import { IndexService } from '@services/index/index.service'

@Controller()
export class IndexController {
  constructor(private readonly service: IndexService) {}

  @Get()
  @HttpCode(200)
  checkService(): string {
    return this.service.checkService()
  }
}
