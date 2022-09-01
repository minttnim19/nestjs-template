import { _Errors } from '@common/interfaces/errors.interface'
import { HttpException, HttpStatus } from '@nestjs/common'

export class JwtException extends HttpException {
  constructor(objectOrError: _Errors) {
    super(objectOrError, HttpStatus.UNAUTHORIZED)
  }

  getResponse(): _Errors {
    return super.getResponse() as _Errors
  }
}
