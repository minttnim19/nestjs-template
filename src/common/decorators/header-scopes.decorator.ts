import { createParamDecorator, ExecutionContext } from '@nestjs/common'

/**
 * filters should be string[] or undefined.
 *
 * example:
 * ```typescript
 * async find(@HeaderScopes(['authorization']) header: object)
 * ```
 */
export const HeaderScopes = createParamDecorator((filters: string[] | undefined, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest()
  const { headers } = req
  return filters === undefined || Object.values(filters).length === 0
    ? headers
    : Object.keys(headers)
        .filter((key) => Object.values(filters).includes(key))
        .reduce((obj, key) => {
          obj[key] = headers[key]
          return obj
        }, {})
})
