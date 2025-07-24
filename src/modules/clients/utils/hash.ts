import { tokenGenerate, tokenSha256 } from '@point-hub/express-utils'

export interface IGenerateClientId {
  (): string
}

export interface IGenerateClientSecret {
  (): string
}

export const generateClientId: IGenerateClientId = () => {
  return `${tokenGenerate()}.auth.pointhub.net`
}

export const generateClientSecret: IGenerateClientSecret = () => {
  return `${tokenSha256(tokenGenerate())}`
}
