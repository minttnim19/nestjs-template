import { getFullUrl } from '@common/functionals'
import { LoggingRequest } from '@common/interfaces/logging.interface'
import {
  ArgumentsHost,
  BadGatewayException,
  BadRequestException,
  Catch,
  ConflictException,
  ExceptionFilter,
  ForbiddenException,
  GatewayTimeoutException,
  GoneException,
  HttpException,
  HttpStatus,
  HttpVersionNotSupportedException,
  ImATeapotException,
  InternalServerErrorException,
  MethodNotAllowedException,
  NotAcceptableException,
  NotFoundException,
  NotImplementedException,
  PayloadTooLargeException,
  PreconditionFailedException,
  RequestTimeoutException,
  ServiceUnavailableException,
  UnauthorizedException,
  UnprocessableEntityException,
  UnsupportedMediaTypeException
} from '@nestjs/common'
import { HttpArgumentsHost } from '@nestjs/common/interfaces'
import { LineNotifyService } from '@shared/line-notify/line-notify.service'
import { JwtException } from '@exceptions/jwt-exception'
import { MessageExceptions } from '@exceptions/message-exceptions'
import { Request } from 'express'
import { IJWToken } from '@common/interfaces/jwt.interface'
import { ILoggingService } from '@shared/logging/interfaces/logging.interface'

@Catch()
export class AllExceptionsFilter
  implements
    ExceptionFilter<
      | BadRequestException
      | UnauthorizedException
      | NotFoundException
      | ForbiddenException
      | NotAcceptableException
      | RequestTimeoutException
      | ConflictException
      | GoneException
      | HttpVersionNotSupportedException
      | PayloadTooLargeException
      | UnsupportedMediaTypeException
      | UnprocessableEntityException
      | InternalServerErrorException
      | NotImplementedException
      | ImATeapotException
      | MethodNotAllowedException
      | BadGatewayException
      | ServiceUnavailableException
      | GatewayTimeoutException
      | PreconditionFailedException
      | JwtException
    >
{
  constructor(private readonly logger: ILoggingService, private readonly notify: LineNotifyService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp()
    const request = ctx.getRequest<Request>()
    const { body, query, params, ip, user, res, method, url } = request
    const userId: string = (() => {
      if (typeof user === 'undefined') {
        return '0'
      }
      const _user: IJWToken = user as IJWToken
      return _user.sub
    })()
    const statusCode: number = res.statusCode
    const clientIp: string = ip.split(':').pop() === '1' ? '0.0.0.0' : ip.split(':').pop()
    const reqAll: LoggingRequest<unknown> = {
      ...body,
      ...query,
      ...params,
      ...{ userId, clientIp, statusCode }
    }
    const route: string = getFullUrl(request)
    const response = ctx.getResponse()
    const errors = new MessageExceptions(exception)
    if (exception instanceof UnauthorizedException || exception instanceof JwtException) {
      this.logger.loggingError('Unauthorized Exception', route, reqAll, errors.errors, HttpStatus.UNAUTHORIZED)
    } else if (exception instanceof HttpException && exception.getStatus() >= 500) {
      const errorMessage = errors.errors.errors.message
      const errorResponse = errors.errors.errors
      const statusCode = errors.status
      this.logger.loggingError(
        `Error HTTP ${statusCode} at ${method || ''} ${url} - ${errorMessage}`,
        route,
        reqAll,
        errorResponse,
        statusCode,
        exception.stack
      )
      this.notify.pushException(exception)
    }
    response.status(errors.status).json(errors.errors)
  }
}
