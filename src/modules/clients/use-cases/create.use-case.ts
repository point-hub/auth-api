import type { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import type { IUniqueValidation } from '@/utils/unique-validation'

import { collectionName, ClientEntity } from '../entity'
import type { IClientNationality } from '../interface'
import type { ICreateClientRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  name?: string
  age?: number
  nationality?: IClientNationality
  notes?: string
}

export interface IDeps {
  createClientRepository: ICreateClientRepository
  schemaValidation: ISchemaValidation
  uniqueValidation: IUniqueValidation
  objClean: IObjClean
}

export interface IOutput {
  inserted_id: string
}

export class CreateClientUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate unique
    await deps.uniqueValidation.handle(collectionName, { name: input.name })
    // 2. validate schema
    await deps.schemaValidation(input, createValidation)
    // 3. define entity
    const clientEntity = new ClientEntity({
      name: input.name,
      age: input.age,
      nationality: input.nationality,
      notes: input.notes,
      created_at: new Date(),
    })
    clientEntity.data = deps.objClean(clientEntity.data)
    // 4. database operation
    const response = await deps.createClientRepository.handle(clientEntity.data)
    // 5. output
    return { inserted_id: response.inserted_id }
  }
}
