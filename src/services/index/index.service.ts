import { Injectable } from '@nestjs/common'

@Injectable()
export class IndexService {
  checkService(): string {
    return 'Welcome to NestJS'
  }
}
