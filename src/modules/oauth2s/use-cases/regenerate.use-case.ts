import type { IUpdateOutput, IUpdateRepository } from '@point-hub/papi'

import { OAuth2Entity } from '../entity'

export interface IInput {
  _id: string
}
export interface IDeps {
  cleanObject(object: object): object
  regenerateRepository: IUpdateRepository
  generateOAuth2(): string
  hashOAuth2(string: string): string
}
export interface IOptions {
  session?: unknown
}

export class RegenerateOAuth2UseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IUpdateOutput> {
    // 1. define entity
    const oAuth2 = deps.generateOAuth2()
    const clientSecret = deps.hashOAuth2(oAuth2)
    const prefixClientSecret = oAuth2.substring(0, 6)
    const oAuth2Entity = new OAuth2Entity({
      prefix_client_secret: prefixClientSecret,
      client_secret: clientSecret,
    })
    oAuth2Entity.generateUpdatedDate()
    const cleanEntity = deps.cleanObject(oAuth2Entity.data)
    // 2. database operation
    const response = await deps.regenerateRepository.handle(input._id, cleanEntity, options)
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
      client_secret: clientSecret,
      prefix_client_secret: prefixClientSecret,
    }
  }
}
