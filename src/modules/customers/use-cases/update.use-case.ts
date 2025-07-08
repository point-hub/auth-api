import type { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import type { IUniqueValidation } from '@/utils/unique-validation'

import { collectionName, CustomerEntity } from '../entity'
import type { ICustomerNationality } from '../interface'
import type { IUpdateCustomerRepository } from '../repositories/update.repository'
import { updateValidation } from '../validations/update.validation'

export interface IInput {
  _id: string
  data: {
    name?: string
    age?: number
    nationality?: ICustomerNationality
    notes?: string
  }
}

export interface IDeps {
  schemaValidation: ISchemaValidation
  updateCustomerRepository: IUpdateCustomerRepository
  uniqueValidation: IUniqueValidation
  objClean: IObjClean
}

export interface IOutput {
  matched_count: number
  modified_count: number
}

export class UpdateCustomerUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate unique
    await deps.uniqueValidation.handle(collectionName, { match: { name: input.data.name } }, input._id)
    // 2. validate schema
    await deps.schemaValidation(input.data, updateValidation)
    // 3. define entity
    const customerEntity = new CustomerEntity({
      name: input.data.name,
      age: input.data.age,
      nationality: input.data.nationality,
      notes: input.data.notes,
      updated_at: new Date(),
    })
    // 4. database operation
    const response = await deps.updateCustomerRepository.handle(input._id, customerEntity.data)
    // 5. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
