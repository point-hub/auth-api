import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateManyClientRepository {
  handle(filter: IDocument, document: IDocument): Promise<IUpdateManyClientOutput>
}

export interface IUpdateManyClientOutput {
  matched_count: number
  modified_count: number
}

export class UpdateManyClientRepository implements IUpdateManyClientRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(filter: IDocument, document: IDocument): Promise<IUpdateManyClientOutput> {
    return await this.database
      .collection(collectionName)
      .updateMany(filter, { $set: document }, { ignoreUndefined: true, ...this.options })
  }
}
