import * as lineApi from 'line-api'
import { HttpException, Injectable } from '@nestjs/common'
import { IErrors } from '@common/interfaces/errors.interface'

@Injectable()
export class LineNotifyService {
  private readonly notify = new lineApi.Notify({
    token: process.env.LINE_NOTIFY_TOKEN
  })

  pushException<T extends HttpException>(exception: T, message?: string | undefined): void {
    if (process.env.NODE_ENV !== 'local') {
      const responseMessage = exception.getResponse()
      let msg = `\r\n` + `env: ${process.env.NODE_ENV}.${process.env.APP_NAME} \r\n` + `stack: ${exception.stack} \r\n`
      if (typeof responseMessage === 'object') {
        const { errors } = responseMessage as IErrors
        msg += `message: ${message ?? exception.message} [${errors.message}] \r\n` + `path: ${errors.path}`
      } else {
        msg += `message: ${message ?? exception.message} [${responseMessage}] \r\n`
      }
      this.notify.send({ message: msg }).then()
    }
  }
}
