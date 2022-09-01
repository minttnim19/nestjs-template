import * as fs from 'fs'
import * as path from 'path'

type fileType = 'private' | 'public'
interface IKeys {
  privateKey?: string
  publicKey: string
}

export const jwtConstants: IKeys = {
  publicKey: getFile('public')
}

function getFile(fileType: fileType) {
  const filenames: string = (() => {
    const isTest: boolean = process.env.NODE_ENV === 'test'
    return isTest ? `oauth-${fileType}.test.key` : `oauth-${fileType}.key`
  })()
  const pathfile = path.resolve(__dirname, '../../storage', '', '')
  return fs.readFileSync(`${pathfile}/${filenames}`, 'utf8')
}
