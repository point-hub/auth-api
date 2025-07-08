import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateCustomerRepository {
  handle(_id: string, document: IDocument): Promise<IUpdateCustomerOutput>
}

export interface IUpdateCustomerOutput {
  matched_count: number
  modified_count: number
}

export class UpdateCustomerRepository implements IUpdateCustomerRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string, document: IDocument): Promise<IUpdateCustomerOutput> {
    return await this.database
      .collection(collectionName)
      .update(_id, { $set: document }, { ignoreUndefined: true, ...this.options })
  }
}
