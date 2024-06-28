import type { ICreateOutput, ICreateRepository, ISchemaValidation } from '@point-hub/papi'

import { OAuth2Entity } from '../entity'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  name?: string
  authorized_urls?: string[]
  redirect_urls?: string[]
}
export interface IDeps {
  cleanObject(object: object): object
  createRepository: ICreateRepository
  schemaValidation: ISchemaValidation
  generateClientId(): string
  generateClientSecret(): string
  hashClientSecret(string: string): string
}
export interface IOptions {
  session?: unknown
}

export class CreateOAuth2UseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<ICreateOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, createValidation)
    // 2. define entity
    const clientId = deps.generateClientId()
    const clientSecret = deps.generateClientSecret()
    const hashedClientSecret = deps.hashClientSecret(clientSecret)
    const oauth2Entity = new OAuth2Entity({
      application_type: 'website',
      name: input.name,
      authorized_urls: input.authorized_urls,
      redirect_urls: input.redirect_urls,
      client_id: clientId,
      client_secret: hashedClientSecret,
      prefix_client_secret: clientSecret.substring(0, 6),
    })
    oauth2Entity.generateCreatedDate()
    const cleanEntity = deps.cleanObject(oauth2Entity.data)
    // 3. database operation
    const response = await deps.createRepository.handle(cleanEntity, options)
    return { inserted_id: response.inserted_id, client_id: clientId, client_secret: clientSecret }
  }
}
