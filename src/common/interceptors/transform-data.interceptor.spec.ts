import { TransformData } from '@common/interceptors/transform-data.interceptor'
import { faker } from '@faker-js/faker'
import { MockExecutionContext } from '@mock/mock.ctx'
import { CallHandler } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { mock } from 'jest-mock-extended'
import { lastValueFrom, of } from 'rxjs'
import { IResponseData } from '@common/interfaces/response.interface'

describe('TransformData', () => {
  let interceptor: TransformData<unknown>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransformData]
    }).compile()
    interceptor = module.get(TransformData)
  })

  it('should be defined', () => {
    expect(interceptor).toBeDefined()
  })

  it('call intercept should inject the result data into the body', async () => {
    const body = {
      email: faker.internet.email(),
      username: faker.internet.userName()
    }
    const ctx: MockExecutionContext = new MockExecutionContext()
    const nextSpy: jest.Mocked<CallHandler> = mock({
      handle: () => of(body)
    })
    const result: IResponseData<unknown> = await lastValueFrom(interceptor.intercept(ctx.executionContext, nextSpy))
    expect(result).toMatchObject({ data: body })
    const { data } = result
    expect(data).toEqual(body)
  })
})
