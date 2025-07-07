import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteClientRepository {
  handle(_id: string): Promise<IDeleteClientOutput>
}

export interface IDeleteClientOutput {
  deleted_count: number
}

export class DeleteClientRepository implements IDeleteClientRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string): Promise<IDeleteClientOutput> {
    return await this.database.collection(collectionName).delete(_id, this.options)
  }
}
