import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'
import type { ICustomerNationality } from '../interface'

export interface IRetrieveCustomerRepository {
  handle(_id: string): Promise<IRetrieveCustomerOutput>
}

export interface IRetrieveCustomerOutput {
  _id: string
  name: string
  age: number
  nationality: ICustomerNationality
  notes: string
  created_at: Date
  updated_at: Date
}

export class RetrieveCustomerRepository implements IRetrieveCustomerRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string): Promise<IRetrieveCustomerOutput> {
    const response = await this.database.collection(collectionName).retrieve(_id, this.options)
    return {
      _id: response._id,
      name: response['name'] as string,
      age: response['age'] as number,
      nationality: response['nationality'] as ICustomerNationality,
      notes: response['notes'] as string,
      created_at: response['created_at'] as Date,
      updated_at: response['updated_at'] as Date,
    }
  }
}
