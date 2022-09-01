type DefaultRequest = {
  // [k: string]: unknown
  correlationId?: string
  userId?: string
  clientIp?: string
  statusCode?: number
}

export type LoggingRequest<T> = T & DefaultRequest
