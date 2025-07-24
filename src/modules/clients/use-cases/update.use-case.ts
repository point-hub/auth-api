import type { ISchemaValidation } from '@point-hub/papi'

import type { IUniqueValidation } from '@/utils/unique-validation'

import { ClientEntity, collectionName } from '../entity'
import type { IUpdateClientRepository } from '../repositories/update.repository'
import type { IGenerateClientId, IGenerateClientSecret } from '../utils/hash'
import { updateValidation } from '../validations/update.validation'

export interface IInput {
  _id: string
  data: {
    name?: string
    authorized_origins?: string[]
    authorized_redirect_uris?: string[]
    state?: string
    scope?: string
  }
}

export interface IDeps {
  schemaValidation: ISchemaValidation
  updateClientRepository: IUpdateClientRepository
  uniqueValidation: IUniqueValidation
  generateClientId: IGenerateClientId
  generateClientSecret: IGenerateClientSecret
}

export interface IOutput {
  matched_count: number
  modified_count: number
}

export class UpdateClientUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input.data, updateValidation)
    // 2. validate unique
    await deps.uniqueValidation.handle(collectionName, { match: { name: input.data.name }, excludeId: input._id })
    // 3. define entity
    const clientEntity = new ClientEntity({
      name: input.data.name,
      client_id: deps.generateClientId(),
      client_secret: deps.generateClientSecret(),
      authorized_origins: input.data.authorized_origins,
      authorized_redirect_uris: input.data.authorized_redirect_uris,
      state: input.data.state,
      scope: input.data.scope,
      updated_at: new Date(),
    })
    // 4. database operation
    const response = await deps.updateClientRepository.handle(input._id, clientEntity.data)
    // 5. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
