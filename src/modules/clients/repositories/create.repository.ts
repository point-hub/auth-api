import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateClientRepository {
  handle(document: IDocument): Promise<ICreateClientOutput>
}

export interface ICreateClientOutput {
  inserted_id: string
}

export class CreateClientRepository implements ICreateClientRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(document: IDocument): Promise<ICreateClientOutput> {
    return await this.database.collection(collectionName).create(document, { ignoreUndefined: true, ...this.options })
  }
}
