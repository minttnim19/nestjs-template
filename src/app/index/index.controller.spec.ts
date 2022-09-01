import { Test, TestingModule } from '@nestjs/testing'
import { IndexController } from './index.controller'
import { IndexService } from '@services/index/index.service'

describe('IndexController', () => {
  let indexController: IndexController

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [IndexController],
      providers: [IndexService]
    }).compile()

    indexController = app.get<IndexController>(IndexController)
  })

  it('should be defined', () => {
    expect(indexController).toBeDefined()
  })

  describe('[Get]: "/" ', () => {
    it('should return "Welcome to NestJS"', () => {
      expect(indexController.checkService()).toBe('Welcome to NestJS')
    })
  })
})
