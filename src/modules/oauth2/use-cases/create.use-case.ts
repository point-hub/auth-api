import type { ICreateOutput, ICreateRepository, ISchemaValidation } from '@point-hub/papi'

import { OAuth2Entity } from '../entity'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  name?: string
  authorized_url?: string[]
  redirect_urls?: string[]
}
export interface IDeps {
  cleanObject(object: object): object
  createRepository: ICreateRepository
  schemaValidation: ISchemaValidation
  generateOAuth2(): string
  hashOAuth2(string: string): string
}
export interface IOptions {
  session?: unknown
}

export class CreateOAuth2UseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<ICreateOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, createValidation)
    // 2. define entity
    const oAuth2 = deps.generateOAuth2()
    const hashedOAuth2 = deps.hashOAuth2(oAuth2)
    const oauth2Entity = new OAuth2Entity({
      name: input.name,
      authorized_url: input.authorized_url,
      redirect_urls: input.redirect_urls,
    })
    oauth2Entity.generateCreatedDate()
    const cleanEntity = deps.cleanObject(oauth2Entity.data)
    // 3. database operation
    const response = await deps.createRepository.handle(cleanEntity, options)
    return { inserted_id: response.inserted_id, api_key: oAuth2 }
  }
}
