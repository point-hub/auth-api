import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateManyCustomerRepository {
  handle(documents: IDocument[]): Promise<ICreateManyCustomerOutput>
}

export interface ICreateManyCustomerOutput {
  inserted_ids: string[]
  inserted_count: number
}

export class CreateManyCustomerRepository implements ICreateManyCustomerRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(documents: IDocument[]): Promise<ICreateManyCustomerOutput> {
    return await this.database
      .collection(collectionName)
      .createMany(documents, { ignoreUndefined: true, ...this.options })
  }
}
