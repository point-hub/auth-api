import type { ISchemaValidation } from '@point-hub/papi'

import type { IUniqueValidation } from '@/utils/unique-validation'

import { ClientEntity, collectionName } from '../entity'
import type { ICreateClientRepository } from '../repositories/create.repository'
import type { IGenerateClientId, IGenerateClientSecret } from '../utils/hash'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  name?: string
  authorized_origins?: string[]
  authorized_redirect_uris?: string[]
  state?: string
  scope?: string
}

export interface IDeps {
  createClientRepository: ICreateClientRepository
  schemaValidation: ISchemaValidation
  uniqueValidation: IUniqueValidation
  generateClientId: IGenerateClientId
  generateClientSecret: IGenerateClientSecret
}

export interface IOutput {
  inserted_id: string
}

export class CreateClientUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate unique
    await deps.uniqueValidation.handle(collectionName, { match: { name: input.name } })
    // 2. validate schema
    await deps.schemaValidation(input, createValidation)
    // 3. define entity
    const clientEntity = new ClientEntity({
      name: input.name,
      client_id: deps.generateClientId(),
      client_secret: deps.generateClientSecret(),
      authorized_origins: input.authorized_origins,
      authorized_redirect_uris: input.authorized_redirect_uris,
      state: input.state,
      scope: input.scope,
      created_at: new Date(),
    })
    clientEntity.cleanData()

    // 4. database operation
    const response = await deps.createClientRepository.handle(clientEntity.data)
    // 5. output
    return { inserted_id: response.inserted_id }
  }
}
