import type { IDatabase, IDocument, IUpdateOutput, IUpdateRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

export class VerifyEmailRepository implements IUpdateRepository {
  public collection = collectionName

  constructor(public database: IDatabase) {}

  async handle(id: string, document: IDocument, options?: unknown): Promise<IUpdateOutput> {
    return await this.database.collection(this.collection).update(id, document, options)
  }
}
