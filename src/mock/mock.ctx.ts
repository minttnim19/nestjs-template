import { ExecutionContext } from '@nestjs/common'
import { HttpArgumentsHost, RpcArgumentsHost, WsArgumentsHost } from '@nestjs/common/interfaces'

export class MockExecutionContext {
  public httpArgumentsHost: HttpArgumentsHost = {
    getRequest: jest.fn(),
    getResponse: jest.fn(),
    getNext: jest.fn()
  }
  public rpcArgumentsHost: RpcArgumentsHost = {
    getData: jest.fn(),
    getContext: jest.fn()
  }
  public WsArgumentsHost: WsArgumentsHost = {
    getData: jest.fn(),
    getClient: jest.fn()
  }
  public executionContext: ExecutionContext = {
    switchToHttp: jest.fn(() => this.httpArgumentsHost),
    getClass: jest.fn(),
    getHandler: jest.fn(),
    getArgs: jest.fn(),
    getArgByIndex: jest.fn(),
    switchToRpc: jest.fn(() => this.rpcArgumentsHost),
    switchToWs: jest.fn(() => this.WsArgumentsHost),
    getType: jest.fn()
  }
}
