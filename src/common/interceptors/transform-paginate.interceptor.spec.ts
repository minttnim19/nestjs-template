import { TransformPaginate } from '@common/interceptors/transform-paginate.interceptor'
import { IResponseData } from '@common/interfaces/response.interface'
import { faker } from '@faker-js/faker'
import { MockExecutionContext } from '@mock/mock.ctx'
import { CallHandler } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { mock } from 'jest-mock-extended'
import { Pagination } from 'nestjs-typeorm-paginate'
import { lastValueFrom, of } from 'rxjs'

interface IBody {
  email: string
  username: string
}
describe('TransformPaginate', () => {
  let interceptor: TransformPaginate<unknown>
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransformPaginate]
    }).compile()
    interceptor = module.get(TransformPaginate)
  })

  it('should be defined', () => {
    expect(interceptor).toBeDefined()
  })
  it('call intercept should inject the result into the body', async () => {
    const body: IBody[] = [
      {
        email: faker.internet.email(),
        username: faker.internet.userName()
      }
    ]
    const pagination: Pagination<IBody> = {
      items: body,
      meta: {
        itemCount: 1,
        itemsPerPage: 1,
        currentPage: 1
      },
      links: {}
    }
    const ctx: MockExecutionContext = new MockExecutionContext()
    const nextSpy: jest.Mocked<CallHandler> = mock({
      handle: () => of(pagination)
    })
    const result: IResponseData<unknown> = await lastValueFrom(interceptor.intercept(ctx.executionContext, nextSpy))
    const { data } = result
    expect(data).toEqual(body)
  })
})
