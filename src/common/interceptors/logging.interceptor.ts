import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { getFullUrl } from '@common/functionals'
import { MessageExceptions } from '@exceptions/message-exceptions'
import { LoggingRequest } from '@common/interfaces/logging.interface'
import { HttpArgumentsHost } from '@nestjs/common/interfaces'
import { Request } from 'express'
import { IJWToken } from '@common/interfaces/jwt.interface'
import { GraylogService } from '@shared/logging/graylog.service'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(@Inject('LOGGING_NAME') private readonly loggingName: string) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const logger: GraylogService = new GraylogService()
    const ctx: HttpArgumentsHost = context.switchToHttp()
    const request = ctx.getRequest<Request>()
    const route: string = getFullUrl(request)
    const { body, query, params, ip, user, res } = request
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
    logger.loggingRequest(this.loggingName, route, reqAll)
    return next.handle().pipe(
      tap({
        next: (res) => {
          logger.loggingResponse(this.loggingName, route, reqAll, res)
        },
        error: (exception: unknown) => {
          const errors = new MessageExceptions(exception)
          logger.loggingError(this.loggingName, route, reqAll, errors.errors, errors.status)
        }
      })
    )
  }
}
