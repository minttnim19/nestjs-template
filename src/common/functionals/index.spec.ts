import * as functions from '@common/functionals'
import { faker } from '@faker-js/faker'
import { Request } from 'express'
import { createRequest, MockRequest } from 'node-mocks-http'
import * as bcrypt from 'bcrypt'

describe('Functionals', () => {
  it('should be defined', () => {
    expect(functions).toBeDefined()
  })

  it('call function getFullUrl', () => {
    const url = `/${faker.address.country().replace(/\s/g, '')}`
    const req: MockRequest<Request> = createRequest({
      method: 'GET',
      url
    })
    expect(functions.getFullUrl(req)).toBe(`${process.env.APP_URL}${url}`)
  })

  describe('call function paginateOption', () => {
    it('without optional params', () => {
      const path = `/${faker.address.country().replace(/\s/g, '')}`
      const req: MockRequest<Request> = createRequest({ route: { path } })
      const _route = `${process.env.APP_URL}${path}`
      const { route } = functions.paginateOption(req)
      expect(route).toBe(_route)
    })
    it('with optional params', () => {
      const path = `/${faker.address.country().replace(/\s/g, '')}`
      const req: MockRequest<Request> = createRequest({ route: { path } })
      const _route = `${process.env.APP_URL}${path}`
      const _page = 1
      const _limit = 15
      const { route, page, limit } = functions.paginateOption(req, _page, _limit)
      expect(route).toBe(_route)
      expect(page).toBe(_page)
      expect(limit).toBe(_limit)
    })
  })

  it('call function asyncForEach', async () => {
    let received = 0
    const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    await functions.asyncForEach(values, (v) => {
      received += v
    })
    expect(received).toEqual(55)
  })

  it('call function promiseAll', async () => {
    const _some1 = faker.address.country()
    const _some2 = faker.address.country()
    const received: { some1?: string; some2?: string } = await functions.promiseAll([
      {
        some1: await (async () => _some1)()
      },
      {
        some2: await (async () => _some2)()
      }
    ])
    const { some1, some2 } = received
    expect(received).toMatchObject({ some1: _some1, some2: _some2 })
    expect(some1).toEqual(_some1)
    expect(some2).toEqual(_some2)
  })

  it('call function ucFirst', async () => {
    const str = 'shk,g-hkot0Ut'
    expect(functions.ucFirst(str)).toBe('Shk,g-hkot0Ut')
  })

  describe('call function removeEmpty', () => {
    it(`remove undefined and return { test1: 'testing'}`, async () => {
      const obj = { test1: 'testing', test2: undefined }
      expect(await functions.removeEmpty(obj)).toEqual({ test1: 'testing' })
    })
    it('remove undefined in object and return object empty ', async () => {
      const obj = { test1: undefined }
      const received = await functions.removeEmpty(obj)
      expect(Object.keys(received).length).toBe(0)
    })
    it('remove empty string in object and return object empty', async () => {
      const obj = { test1: '' }
      const received = await functions.removeEmpty(obj)
      expect(Object.keys(received).length).toBe(0)
    })
    it('remove null in object and return object empty', async () => {
      const obj = { test1: null }
      const received = await functions.removeEmpty(obj)
      expect(Object.keys(received).length).toBe(0)
    })
  })

  describe('call function enumKeyOf and enumValueOf', () => {
    enum eNum {
      KEY1 = 'value1',
      KEY2 = 'value2'
    }
    it('function enumKeyOf', () => {
      expect(functions.enumKeyOf(eNum)).toEqual(['KEY1', 'KEY2'])
    })
    it('function enumValueOf', () => {
      expect(functions.enumValueOf(eNum)).toEqual(['value1', 'value2'])
    })
  })

  it('call function bin2hex', async () => {
    expect(functions.bin2hex(16)).toHaveLength(32)
  })

  it('call function bCrypt', async () => {
    const bCrypt = functions.bCrypt('hellow', 10)
    expect(await bcrypt.compare('hellow', bCrypt.replace(/^\$2y(.+)$/i, '$2a$1'))).toEqual(true)
  })
})
