import type { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import type { IUniqueValidation } from '@/utils/unique-validation'

import { collectionName, CustomerEntity } from '../entity'
import type { ICustomerNationality } from '../interface'
import type { ICreateCustomerRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  name?: string
  age?: number
  nationality?: ICustomerNationality
  notes?: string
}

export interface IDeps {
  createCustomerRepository: ICreateCustomerRepository
  schemaValidation: ISchemaValidation
  uniqueValidation: IUniqueValidation
  objClean: IObjClean
}

export interface IOutput {
  inserted_id: string
}

export class CreateCustomerUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate unique
    await deps.uniqueValidation.handle(collectionName, { match: input })
    // 2. validate schema
    await deps.schemaValidation(input, createValidation)
    // 3. define entity
    const customerEntity = new CustomerEntity({
      name: input.name,
      age: input.age,
      nationality: input.nationality,
      notes: input.notes,
      created_at: new Date(),
    })
    customerEntity.data = deps.objClean(customerEntity.data)
    // 4. database operation
    const response = await deps.createCustomerRepository.handle(customerEntity.data)
    // 5. output
    return { inserted_id: response.inserted_id }
  }
}
