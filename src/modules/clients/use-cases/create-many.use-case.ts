import type { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import type { IUniqueValidation } from '@/utils/unique-validation'

import { ClientEntity, collectionName } from '../entity'
import type { IClientNationality } from '../interface'
import type { ICreateManyClientRepository } from '../repositories/create-many.repository'
import { createManyValidation } from '../validations/create-many.validation'

export interface IInput {
  clients: {
    name?: string
    age?: number
    nationality?: IClientNationality
    notes?: string
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
    // 2. validate unique
    const filters = input.clients.map((client) => ({
      match: { name: client.name },
      pathPrefix: collectionName,
    }))
    await deps.uniqueValidation.handleMany(collectionName, filters)
    // 3. define entity
    const entities = []
    for (const document of input.clients) {
      const clientEntity = new ClientEntity({
        name: document.name,
        age: document.age,
        nationality: document.nationality,
        notes: document.notes,
        created_at: new Date(),
      })
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
