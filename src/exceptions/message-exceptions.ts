import {
  BadRequestException,
  HttpException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
  ValidationError
} from '@nestjs/common'
import { QueryFailedError } from 'typeorm'
import { IErrors, _Errors } from '@common/interfaces/errors.interface'
import { JwtException } from './jwt-exception'

export class MessageExceptions {
  private _errors: IErrors
  private _status: number

  constructor(exception: unknown) {
    if (exception instanceof JwtException) {
      this.errors = { errors: exception.getResponse() }
      this.status = exception.getStatus()
    } else if (exception instanceof UnauthorizedException) {
      this.errors = {
        errors: {
          statusCode: exception.getStatus(),
          message: exception.message
        }
      }
      this.status = HttpStatus.UNAUTHORIZED
    } else if (exception instanceof NotFoundException) {
      const { status, errors } = this.notFoundException(exception)
      this.errors = { errors }
      this.status = status
    } else if (exception instanceof BadRequestException) {
      const { status, errors } = this.validateException(exception)
      this.errors = { errors }
      this.status = status
    } else if (exception instanceof QueryFailedError) {
      this.errors = {
        errors: {
          statusCode: HttpStatus.EXPECTATION_FAILED,
          message: 'Expectation Field',
          errors: exception.message ?? 'Something Went Wrong'
        }
      }
      this.status = HttpStatus.EXPECTATION_FAILED
    } else if (exception instanceof HttpException) {
      this.errors = {
        errors: {
          statusCode: exception.getStatus(),
          message: exception.message
        }
      }
      this.status = exception.getStatus()
    } else {
      const message = exception instanceof Error ? exception.message : 'Internal Server Error'
      this.errors = {
        errors: {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message
        }
      }
      this.status = HttpStatus.INTERNAL_SERVER_ERROR
    }
  }

  get status(): number {
    return this._status
  }

  set status(value: number) {
    this._status = value
  }

  get errors(): IErrors {
    return this._errors
  }

  set errors(value: IErrors) {
    this._errors = value
  }

  private notFoundException(exception: NotFoundException): {
    status: number
    errors: _Errors
  } {
    const { message } = exception
    const splitText: string[] = message.split(' ')
    const method = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    let status: number = HttpStatus.NOT_FOUND
    let errors: _Errors
    if (splitText[0] === 'Cannot' && method.includes(splitText[1])) {
      status = HttpStatus.METHOD_NOT_ALLOWED
      errors = {
        statusCode: status,
        message: 'Method not Allowed'
      }
    } else {
      errors = {
        statusCode: status,
        message
      }
    }
    return { status, errors }
  }

  protected validateException(exception: BadRequestException): {
    status: number
    errors: _Errors
  } {
    let status: number = HttpStatus.BAD_REQUEST
    let errors: _Errors
    const response = exception.getResponse() as {
      statusCode: string
      message: string | [ValidationError]
    }
    const { message } = response
    if (typeof message === 'object' && message.length > 0) {
      status = HttpStatus.UNPROCESSABLE_ENTITY
      errors = {
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: `The given data was invalid.`,
        errors: this.handleValidationError(message)
      }
    } else {
      errors = {
        statusCode: status,
        message: exception.message
      }
    }
    return { status, errors }
  }

  protected handleValidationError(
    errors: ValidationError[],
    errorField = '',
    result: { [key: string]: string[] } = {}
  ) {
    ;(errors || []).forEach((children) => {
      const mainFieldKey = children.property
      if (typeof children.children === 'undefined' || children.children.length === 0) {
        const _errorField = errorField + '.' + mainFieldKey
        const message = Object.keys(children.constraints).map((key) => children.constraints[key])
        result[_errorField.substring(1)] = message
      } else {
        errorField += '.' + mainFieldKey
        this.handleValidationError(children.children, errorField, result)
      }
    })
    return result
  }
}
