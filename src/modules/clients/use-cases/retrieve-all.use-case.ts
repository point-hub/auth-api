import type { IPagination, IQuery } from '@point-hub/papi'

import type { IRetrieveClientOutput } from '../repositories/retrieve.repository'
import type { IRetrieveAllClientRepository } from '../repositories/retrieve-all.repository'

export interface IInput {
  query: IQuery
}

export interface IDeps {
  retrieveAllClientRepository: IRetrieveAllClientRepository
}

export interface IOutput {
  data: IRetrieveClientOutput[]
  pagination: IPagination
}

export class RetrieveAllClientUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveAllClientRepository.handle(input.query)
    // 2. output
    return {
      data: response.data,
      pagination: response.pagination,
    }
  }
}
