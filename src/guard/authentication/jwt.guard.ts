import { JwtException } from '@exceptions/jwt-exception'
import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { jwtMessage } from '@guard/authentication/jwt.exception'

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context)
  }

  handleRequest(err, user, info) {
    if (typeof info !== 'undefined') {
      switch (info.message) {
        case 'invalid signature':
          throw new JwtException(jwtMessage.TokenInvalidException)
        case 'jwt expired':
          throw new JwtException(jwtMessage.TokenExpiredException)
        case 'No auth token':
          throw new JwtException(jwtMessage.TokenNotProvidedException)
        case 'jwt malformed':
          throw new JwtException(jwtMessage.TokenInvalidException)
      }
    }
    return user
  }
}
