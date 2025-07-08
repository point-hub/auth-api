import type { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import type { IUniqueValidation } from '@/utils/unique-validation'

import { collectionName, CustomerEntity } from '../entity'
import type { ICustomerNationality } from '../interface'
import type { ICreateManyCustomerRepository } from '../repositories/create-many.repository'
import { createManyValidation } from '../validations/create-many.validation'

export interface IInput {
  customers: {
    name?: string
    age?: number
    nationality?: ICustomerNationality
    notes?: string
  }[]
}

export interface IDeps {
  schemaValidation: ISchemaValidation
  createManyCustomerRepository: ICreateManyCustomerRepository
  uniqueValidation: IUniqueValidation
  objClean: IObjClean
}

export interface IOutput {
  inserted_count: number
  inserted_ids: string[]
}

export class CreateManyCustomerUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation({ customers: input.customers }, createManyValidation)
    await deps.uniqueValidation.handle(collectionName, { match: input })
    // 2. define entity
    const entities = []
    for (const document of input.customers) {
      // 3. validate unique
      const customerEntity = new CustomerEntity({
        name: document.name,
        age: document.age,
        nationality: document.nationality,
        notes: document.notes,
        created_at: new Date(),
      })
      customerEntity.data = deps.objClean(customerEntity.data)
      entities.push(customerEntity.data)
    }
    // 4. database operation
    const response = await deps.createManyCustomerRepository.handle(entities)
    // 5. output
    return {
      inserted_ids: response.inserted_ids,
      inserted_count: response.inserted_count,
    }
  }
}
