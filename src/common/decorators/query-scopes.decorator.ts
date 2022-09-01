import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'

export const QueryScopes = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>()
  const { query } = request
  const _request = Object.keys(query).reduce((obj, key) => {
    const _key = key.split('.')
    if (_key.length === 2) {
      Object.assign(obj, { [`${_key[0]}`]: { [`${_key[1]}`]: query[key] } })
    } else {
      obj[key] = query[key]
    }
    return obj
  }, {})
  return _request
})
