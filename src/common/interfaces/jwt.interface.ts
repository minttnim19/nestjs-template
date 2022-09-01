export interface IJWToken {
  aud: string
  jti: string
  iat: number
  nbf: number
  exp: number
  sub: string
  scopes: string[]
  projects: string[]
  groupsInternal: string[]
  groupsStandard: string[]
  groupsCustom: string[]
  roles: string[]
  permissions: string[]
  groupId: number
  userInfo: IUserInfo
  brandId: number[]
  outletId: number[]
  legalCompanyId: number[]
}

interface IUserInfo {
  id: number
  name: string
  lastName: string
  email: string
  type: string
  createdAt: string
}
