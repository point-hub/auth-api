import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteManyClientRepository {
  handle(_ids: string[]): Promise<IDeleteManyClientOutput>
}

export interface IDeleteManyClientOutput {
  deleted_count: number
}

export class DeleteManyClientRepository implements IDeleteManyClientRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(ids: string[]): Promise<IDeleteManyClientOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, this.options)
  }
}
