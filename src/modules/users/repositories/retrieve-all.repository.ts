import type { IDatabase, IQuery, IRetrieveAllOutput, IRetrieveAllRepository } from '@point-hub/papi'

import { collectionName } from '../entity'
import { IRetrieveUserOutput } from './retrieve.repository'

export interface IRetrieveAllUserOutput extends IRetrieveAllOutput {
  data: IRetrieveUserOutput[]
}
export interface RetrieveAllUserRepository extends IRetrieveAllRepository {
  handle(query: IQuery, options?: unknown): Promise<IRetrieveAllUserOutput>
}

export class RetrieveAllRepository implements RetrieveAllUserRepository {
  constructor(public database: IDatabase) {}

  async handle(query: IQuery, options?: unknown): Promise<IRetrieveAllUserOutput> {
    const users = await this.database.collection(collectionName).retrieveAll(query, options)
    return {
      data: users.data as IRetrieveUserOutput[],
      pagination: users.pagination,
    }
  }
}
