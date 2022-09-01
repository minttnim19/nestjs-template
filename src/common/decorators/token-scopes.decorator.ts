import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { IJWToken } from '@common/interfaces/jwt.interface'

/**
 * filters should be string[] or undefined.
 *
 * example:
 * ```typescript
 * async find(@TokenScopes(['projects']) header: Partial<IJWToken>)
 * ```
 */
export const TokenScopes = createParamDecorator(
  (filters: string[] | unknown, ctx: ExecutionContext): Partial<IJWToken> => {
    const request = ctx.switchToHttp().getRequest()
    return filters === undefined || Object.values(filters).length === 0
      ? request.user
      : Object.keys(request.user ?? [])
          .filter((key) => Object(filters).includes(key))
          .reduce((obj, key) => {
            obj[key] = request.user[key] ?? null
            return obj
          }, {})
  }
)
