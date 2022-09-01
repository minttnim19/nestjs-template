export interface IExceptionMessage {
  statusCode: number
  message: string
}

export const jwtMessage = {
  AuthException: {
    statusCode: 4010,
    message: 'The requested resource failed authorization.'
  },
  TokenNotProvidedException: {
    statusCode: 4010,
    message: 'Token not provided.'
  },
  TokenExpiredException: {
    statusCode: 4012,
    message: 'Provided token is expired.'
  },
  TokenInvalidException: {
    statusCode: 4013,
    message: 'Token Invalid.'
  },
  RefreshExpiredException: {
    statusCode: 4014,
    message: 'Refresh has expired.'
  },
  RefreshDecryptException: {
    statusCode: 4015,
    message: 'Can’t decrypt the refresh token.'
  },
  UnauthorizedException: {
    statusCode: 4016,
    message: 'Unauthorized'
  },
  RefreshRevokedException: {
    statusCode: 4017,
    message: 'Refresh has been revoked.'
  }
}

export class JwtException {
  public custom = async (status: number, message: string): Promise<IExceptionMessage> => {
    return { statusCode: status, message }
  }
}
