import { JwtException } from '@exceptions/jwt-exception'
import { jwtMessage } from '@guard/authentication/jwt.exception'
import { IJWToken } from '@common/interfaces/jwt.interface'
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler()) ?? []
    const permissions = this.reflector.get<string[]>('permissions', context.getHandler()) ?? []
    // const systems = this.reflector.get<string[]>('systems', context.getHandler()) ?? []
    const request = context.switchToHttp().getRequest<Request>()
    const _user = (() => {
      const { user } = request
      if (typeof user !== 'undefined') {
        return user as IJWToken
      }
      return undefined
    })()
    return this.checkAuthorization(_user, roles, permissions)
  }

  checkAuthorization(user: IJWToken | undefined, roles: string[], permissions: string[]): boolean {
    if (typeof user === 'undefined') {
      throw new JwtException(jwtMessage.TokenInvalidException)
    }
    const { roles: userRole, permissions: userPermissions } = user
    const checkRoles: boolean = userRole.some((r: string) => roles.indexOf(r) >= 0)
    const checkPermissions: boolean = userPermissions.some((r: string) => permissions.indexOf(r) >= 0)
    if (checkRoles || checkPermissions) {
      return true
    } else {
      throw new JwtException(jwtMessage.UnauthorizedException)
    }
  }
}
