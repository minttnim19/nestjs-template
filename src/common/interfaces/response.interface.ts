import { _Errors } from '@common/interfaces/errors.interface'

export interface IResponseData<T = unknown> {
  data: T | T[]
  meta?: IMeta
}
export interface IResponseErrors {
  errors: _Errors
}

interface IMeta {
  pagination: IPagination
}

interface IPagination {
  total: number
  count: number
  perPage: number
  currentPage: number
  totalPages: number
  links?: {
    previous: string
    next: string
  }
}
