import { LoggingRequest } from '@common/interfaces/logging.interface'
import { IResponseErrors } from '@common/interfaces/response.interface'
import { Injectable } from '@nestjs/common'
import * as strings from '@supercharge/strings/dist'
import * as moment from 'moment'
import * as os from 'os'
import { ILoggingService } from '@shared/logging/interfaces/logging.interface'

@Injectable()
export class LocalLoggingService implements ILoggingService {
  private readonly date: string
  private readonly time: string
  private readonly correlationId: string
  private readonly optional: { [key: string]: unknown }
  private readonly prefix: string = 'HORECA'
  private rand: string

  constructor() {
    this.date = moment().format('Ymd')
    this.time = moment().format('HHmmss')
    this.rand = strings.random(2)
    this.correlationId = `D${this.date}T${this.time}${this.rand}`
    this.optional = {
      [`host_name`]: `${process.env.APP_URL}`,
      [`level_name`]: 'info',
      version: '1.0',
      [`host_ip`]: this.hostIp()
    }
  }

  loggingRequest<T>(name: string, endpoint: string, request: LoggingRequest<T>): void {
    this.optional.endpoint = endpoint
    this.optional[`in_request`] = 'in_request'
    this.optional.tag = name
    const { correlationId, userId, clientIp, statusCode, ...newReq } = request
    this.optional[`http_status_code`] = statusCode
    this.optional.request = newReq
    this.optional.relationId = this.getCorrelationId(correlationId, userId)
    this.optional[`client_ip`] = clientIp ?? '0.0.0.0'
    delete this.optional.response
    const nameLog = `${name}: Request`
    console.info(`${nameLog} ${JSON.stringify(this.optional)}`)
  }

  loggingResponse<T, U>(
    name: string,
    endpoint: string,
    request: LoggingRequest<T>,
    response: U | IResponseErrors
  ): void {
    let nameLog = `${name}: Response(Success)`
    this.optional.endpoint = endpoint
    this.optional[`in_request`] = 'in_response'
    this.optional.tag = name
    const { correlationId, userId, clientIp, statusCode, ...newReq } = request
    this.optional.request = newReq
    this.optional.relationId = this.getCorrelationId(correlationId, userId)
    this.optional[`client_ip`] = clientIp ?? '0.0.0.0'
    this.optional.response = response
    this.optional[`http_status_code`] = statusCode
    if (typeof response === 'object' && 'errors' in response) {
      nameLog = `${name}: Response(Error)`
      this.optional[`http_status_code`] = response.errors.statusCode
      console.error(`${nameLog} ${JSON.stringify(this.optional)}`)
    } else {
      console.info(`${nameLog} ${JSON.stringify(this.optional)}`)
    }
  }

  loggingError<T>(
    name: string,
    endpoint: string,
    request: LoggingRequest<T>,
    response: unknown,
    _statusCode: number,
    errorStack: unknown = undefined
  ): void {
    this.optional.endpoint = endpoint
    this.optional[`in_request`] = 'in_response'
    this.optional.tag = name
    request.statusCode = _statusCode
    const { correlationId, userId, clientIp, statusCode, ...newReq } = request
    this.optional.request = newReq
    this.optional[`http_status_code`] = statusCode
    this.optional.relationId = this.getCorrelationId(correlationId, userId)
    this.optional[`client_ip`] = clientIp ?? '0.0.0.0'
    if (typeof errorStack !== 'undefined') {
      this.optional[`error_stack`] = errorStack
    }
    const nameLog = `${name}: Response(Error)`
    this.optional.response = response
    console.error(`${nameLog} ${JSON.stringify(this.optional)}`)
  }

  private getCorrelationId(correlationId: string | undefined, userId: string): string {
    return typeof correlationId === 'undefined' ? `${this.prefix}${this.correlationId}${userId}` : correlationId
  }

  private hostIp(): string {
    const ifaces = os.networkInterfaces()
    let _hostIp = ''
    Object.keys(ifaces).forEach(function (name) {
      ifaces[name].forEach(function (iface) {
        if ('IPv4' === iface.family || iface.internal === false) {
          _hostIp = iface.address
        }
      })
    })
    return _hostIp
  }
}
