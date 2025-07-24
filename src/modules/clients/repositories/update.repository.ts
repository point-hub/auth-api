import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateClientRepository {
  handle(_id: string, document: IDocument): Promise<IUpdateClientOutput>
}

export interface IUpdateClientOutput {
  matched_count: number
  modified_count: number
}

export class UpdateClientRepository implements IUpdateClientRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string, document: IDocument): Promise<IUpdateClientOutput> {
    return await this.database
      .collection(collectionName)
      .update(_id, { $set: document }, { ignoreUndefined: true, ...this.options })
  }
}
