import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'
import type { IClientNationality } from '../interface'

export interface IRetrieveClientRepository {
  handle(_id: string): Promise<IRetrieveClientOutput>
}

export interface IRetrieveClientOutput {
  _id: string
  name: string
  age: number
  nationality: IClientNationality
  notes: string
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
      age: response['age'] as number,
      nationality: response['nationality'] as IClientNationality,
      notes: response['notes'] as string,
      created_at: response['created_at'] as Date,
      updated_at: response['updated_at'] as Date,
    }
  }
}
