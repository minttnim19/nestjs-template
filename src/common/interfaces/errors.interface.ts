interface __Errors {
  [key: string]: string[]
}

export interface _Errors {
  statusCode: number
  message: string
  path?: string
  errors?: __Errors | string
}

export interface IErrors {
  errors: _Errors
}
