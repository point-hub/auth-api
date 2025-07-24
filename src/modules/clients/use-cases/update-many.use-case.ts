import type { IObjClean } from '@point-hub/express-utils'
import type { IDocument, ISchemaValidation } from '@point-hub/papi'

import { ClientEntity } from '../entity'
import type { IClientNationality } from '../interface'
import type { IUpdateManyClientRepository } from '../repositories/update-many.repository'
import { updateManyValidation } from '../validations/update-many.validation'

export interface IInput {
  filter: IDocument
  data: {
    name?: string
    age?: number
    nationality?: IClientNationality
    notes?: string
  }
}

export interface IDeps {
  schemaValidation: ISchemaValidation
  updateManyClientRepository: IUpdateManyClientRepository
  objClean: IObjClean
}

export interface IOptions {
  session?: unknown
}

export interface IOutput {
  matched_count: number
  modified_count: number
}

export class UpdateManyClientUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input.data, updateManyValidation)
    // 2. define entity
    const clientEntity = new ClientEntity({
      name: input.data.name,
      age: input.data.age,
      nationality: input.data.nationality,
      notes: input.data.notes,
      updated_at: new Date(),
    })
    clientEntity.data = deps.objClean(clientEntity.data)
    // 3. database operation
    const response = await deps.updateManyClientRepository.handle(input.filter, clientEntity.data)
    // 4. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
