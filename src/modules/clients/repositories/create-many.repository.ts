import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateManyClientRepository {
  handle(documents: IDocument[]): Promise<ICreateManyClientOutput>
}

export interface ICreateManyClientOutput {
  inserted_ids: string[]
  inserted_count: number
}

export class CreateManyClientRepository implements ICreateManyClientRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(documents: IDocument[]): Promise<ICreateManyClientOutput> {
    return await this.database
      .collection(collectionName)
      .createMany(documents, { ignoreUndefined: true, ...this.options })
  }
}
