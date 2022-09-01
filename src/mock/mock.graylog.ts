import { ILoggingService } from '@shared/logging/interfaces/logging.interface'

export class MockGraylog implements ILoggingService {
  public loggingRequest = jest.fn()
  public loggingResponse = jest.fn()
  public loggingError = jest.fn()
}
