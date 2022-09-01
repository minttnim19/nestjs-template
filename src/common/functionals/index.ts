import { randomBytes } from 'crypto'
import { Request } from 'express'
import { IPaginationOptions } from 'nestjs-typeorm-paginate'
import * as bcrypt from 'bcrypt'

export function getFullUrl(req: Request): string {
  return process.env.APP_URL + req.url
}
export function paginateOption(request: Request, page = 1, limit = 15): IPaginationOptions {
  const {
    route: { path }
  } = request
  const route = `${process.env.APP_URL}${path}`
  return { page, limit, route }
}
export async function asyncForEach<T, C>(array: T[], callback: (arg0: T, arg1: number, arg2: T[]) => C) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}
export async function promiseAll<T>(values: Iterable<T | PromiseLike<T>>): Promise<T> {
  return await Promise.all(values).then((v: T[]) => {
    return v.reduce((result: T, obj: T) => ({ ...result, ...obj }))
  })
}
export function ucFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
export async function removeEmpty<T>(obj: T): Promise<T> {
  return Object.entries(obj)
    .filter(([, v]) => v !== null && typeof v !== 'undefined' && v.length !== 0)
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {} as T)
}
export function enumValueOf<E extends { [s: number]: number | string }>(eNum: E): (number | string)[] {
  return [
    ...new Set(
      Object.values(eNum).filter((item) => {
        return isNaN(Number(item))
      })
    )
  ]
}
export function enumKeyOf<E extends { [s: number]: number | string }>(eNum: E): (number | string)[] {
  return [
    ...new Set(
      Object.keys(eNum).filter((item) => {
        return isNaN(Number(item))
      })
    )
  ]
}
export function bin2hex(byte: number) {
  return Buffer.from(randomBytes(byte)).toString('hex')
}
export function bCrypt(data: string | Buffer, saltOrRounds: string | number) {
  return bcrypt.hashSync(data, saltOrRounds).replace(/^\$2b(.+)$/i, '$2y$1')
}
