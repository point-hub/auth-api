import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IRetrieveClientRepository {
  handle(_id: string): Promise<IRetrieveClientOutput>
}

export interface IRetrieveClientOutput {
  _id: string
  name: string
  client_id: string
  client_secret: string
  authorized_origins: string[]
  authorized_redirect_uris: string[]
  created_at: Date
  updated_at: Date
}

export class RetrieveClientRepository implements IRetrieveClientRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string): Promise<IRetrieveClientOutput> {
    const response = await this.database.collection(collectionName).retrieve(_id, this.options)
    return {
      _id: response._id,
      name: response['name'] as string,
      client_id: response['client_id'] as string,
      client_secret: response['client_secret'] as string,
      authorized_origins: response['authorized_origins'] as string[],
      authorized_redirect_uris: response['authorized_redirect_uris'] as string[],
      created_at: response['created_at'] as Date,
      updated_at: response['updated_at'] as Date,
    }
  }
}
