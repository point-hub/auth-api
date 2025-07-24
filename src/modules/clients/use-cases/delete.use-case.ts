import type { ISchemaValidation } from '@point-hub/papi'

import type { IDeleteClientRepository } from '../repositories/delete.repository'
import { deleteValidation } from '../validations/delete.validation'

export interface IInput {
  _id: string
}

export interface IDeps {
  schemaValidation: ISchemaValidation
  deleteClientRepository: IDeleteClientRepository
}

export interface IOutput {
  deleted_count: number
}

export class DeleteClientUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, deleteValidation)
    // 2. database operation
    const response = await deps.deleteClientRepository.handle(input._id)
    // 3. output
    return { deleted_count: response.deleted_count }
  }
}
