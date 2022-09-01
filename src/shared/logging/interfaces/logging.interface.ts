import { LoggingRequest } from '@common/interfaces/logging.interface'
import { IResponseErrors } from '@common/interfaces/response.interface'

export interface ILoggingService {
  loggingRequest<T>(name: string, endpoint: string, request: LoggingRequest<T>): void
  loggingResponse<T, U>(name: string, endpoint: string, request: LoggingRequest<T>, response: U | IResponseErrors): void
  loggingError<T>(
    name: string,
    endpoint: string,
    request: LoggingRequest<T>,
    response: unknown,
    _statusCode: number,
    errorStack?: unknown
  ): void
}
