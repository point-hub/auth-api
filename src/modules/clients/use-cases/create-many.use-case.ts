import type { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import type { IUniqueValidation } from '@/utils/unique-validation'

import { collectionName, ClientEntity } from '../entity'
import type { ICreateManyClientRepository } from '../repositories/create-many.repository'
import { createManyValidation } from '../validations/create-many.validation'

export interface IInput {
  clients: {
    name?: string
    phone?: string
  }[]
}

export interface IDeps {
  schemaValidation: ISchemaValidation
  createManyClientRepository: ICreateManyClientRepository
  uniqueValidation: IUniqueValidation
  objClean: IObjClean
}

export interface IOutput {
  inserted_count: number
  inserted_ids: string[]
}

export class CreateManyClientUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation({ clients: input.clients }, createManyValidation)
    // 2. define entity
    const entities = []
    for (const document of input.clients) {
      // 3. validate unique
      await deps.uniqueValidation.handle(collectionName, { name: document.name })
      const clientEntity = new ClientEntity({
        name: document.name,
        phone: document.phone,
      })
      clientEntity.generateDate('created_date')
      clientEntity.data = deps.objClean(clientEntity.data)
      entities.push(clientEntity.data)
    }
    // 4. database operation
    const response = await deps.createManyClientRepository.handle(entities)
    // 5. output
    return {
      inserted_ids: response.inserted_ids,
      inserted_count: response.inserted_count,
    }
  }
}
