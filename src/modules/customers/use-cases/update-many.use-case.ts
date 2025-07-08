import type { IObjClean } from '@point-hub/express-utils'
import type { IDocument, ISchemaValidation } from '@point-hub/papi'

import { CustomerEntity } from '../entity'
import type { ICustomerNationality } from '../interface'
import type { IUpdateManyCustomerRepository } from '../repositories/update-many.repository'
import { updateManyValidation } from '../validations/update-many.validation'

export interface IInput {
  filter: IDocument
  data: {
    name?: string
    age?: number
    nationality?: ICustomerNationality
    notes?: string
  }
}

export interface IDeps {
  schemaValidation: ISchemaValidation
  updateManyCustomerRepository: IUpdateManyCustomerRepository
  objClean: IObjClean
}

export interface IOptions {
  session?: unknown
}

export interface IOutput {
  matched_count: number
  modified_count: number
}

export class UpdateManyCustomerUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input.data, updateManyValidation)
    // 2. define entity
    const customerEntity = new CustomerEntity({
      name: input.data.name,
      age: input.data.age,
      nationality: input.data.nationality,
      notes: input.data.notes,
      updated_at: new Date(),
    })
    customerEntity.data = deps.objClean(customerEntity.data)
    // 3. database operation
    const response = await deps.updateManyCustomerRepository.handle(input.filter, customerEntity.data)
    // 4. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
