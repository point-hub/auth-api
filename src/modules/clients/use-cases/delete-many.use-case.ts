import type { ISchemaValidation } from '@point-hub/papi'

import type { IDeleteManyClientRepository } from '../repositories/delete-many.repository'
import { deleteManyValidation } from '../validations/delete-many.validation'

export interface IInput {
  ids: string[]
}

export interface IDeps {
  schemaValidation: ISchemaValidation
  deleteManyClientRepository: IDeleteManyClientRepository
}

export interface IOutput {
  deleted_count: number
}

export class DeleteManyClientUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, deleteManyValidation)
    // 2. database operation
    const response = await deps.deleteManyClientRepository.handle(input.ids)
    // 3. output
    return { deleted_count: response.deleted_count }
  }
}
