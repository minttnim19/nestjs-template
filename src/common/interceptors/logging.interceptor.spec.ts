import { LoggingInterceptor } from '@common/interceptors/logging.interceptor'
import { CallHandler } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { createRequest, MockRequest } from 'node-mocks-http'
import { mock } from 'jest-mock-extended'
import { lastValueFrom, of, throwError } from 'rxjs'
import { MockExecutionContext } from '@mock/mock.ctx'
import { Request } from 'express'
import { IJWToken } from '@common/interfaces/jwt.interface'
import { faker } from '@faker-js/faker'
jest.mock('@shared/logging/graylog.service') // GraylogService is now a mock constructor
jest.mock('@exceptions/message-exceptions') // MessageExceptions is now a mock constructor

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: 'LOGGING_NAME', useValue: 'UnitTest' }, LoggingInterceptor]
    }).compile()
    interceptor = module.get(LoggingInterceptor)
  })

  it('should be defined', () => {
    expect(interceptor).toBeDefined()
  })

  describe('call intercept', () => {
    const body = {
      email: faker.internet.email(),
      username: faker.internet.userName()
    }
    it('should inject the result into the body', async () => {
      const req: MockRequest<Request> = createRequest({
        body,
        query: {},
        params: {},
        ip: ':1',
        user: undefined,
        res: { statusCode: 200 }
      })
      const ctx: MockExecutionContext = new MockExecutionContext()
      const getRequestSpy = jest.spyOn(ctx.executionContext.switchToHttp(), 'getRequest').mockReturnValueOnce(req)
      expect(getRequestSpy).not.toHaveBeenCalled()
      const nextSpy: jest.Mocked<CallHandler> = mock({
        handle: () => of(body)
      })
      await expect(lastValueFrom(interceptor.intercept(ctx.executionContext, nextSpy))).resolves.toEqual(body)
      expect(getRequestSpy).toHaveBeenCalled()
    })
    it('should inject the result into the body and user is not undefined', async () => {
      const user: IJWToken = {
        aud: '',
        jti: '',
        iat: 0,
        nbf: 0,
        exp: 0,
        sub: '1',
        scopes: [],
        projects: [],
        groupsInternal: [],
        groupsStandard: [],
        groupsCustom: [],
        roles: [],
        permissions: [],
        groupId: 0,
        userInfo: undefined,
        brandId: [],
        outletId: [],
        legalCompanyId: []
      }
      const req: MockRequest<Request> = createRequest({
        body,
        query: {},
        params: {},
        ip: '127.0.0.1',
        user,
        res: { statusCode: 200 }
      })
      const ctx: MockExecutionContext = new MockExecutionContext()
      const getRequestSpy = jest.spyOn(ctx.executionContext.switchToHttp(), 'getRequest').mockReturnValueOnce(req)
      expect(getRequestSpy).not.toHaveBeenCalled()
      const nextSpy: jest.Mocked<CallHandler> = mock({
        handle: () => of(body)
      })
      await expect(lastValueFrom(interceptor.intercept(ctx.executionContext, nextSpy))).resolves.toEqual(body)
      expect(getRequestSpy).toHaveBeenCalled()
    })
    it('should reject with error', async () => {
      const req: MockRequest<Request> = createRequest({
        body,
        query: {},
        params: {},
        ip: '127.0.0.1',
        user: undefined,
        res: { statusCode: 200 }
      })
      const ctx: MockExecutionContext = new MockExecutionContext()
      const getRequestSpy = jest.spyOn(ctx.executionContext.switchToHttp(), 'getRequest').mockReturnValueOnce(req)
      expect(getRequestSpy).not.toHaveBeenCalled()
      const err = new Error('test')
      const nextSpy: jest.Mocked<CallHandler> = mock({
        handle: () => throwError(() => err)
      })
      await expect(lastValueFrom(interceptor.intercept(ctx.executionContext, nextSpy))).rejects.toThrow(Error)
      expect(getRequestSpy).toHaveBeenCalled()
    })
  })
})
