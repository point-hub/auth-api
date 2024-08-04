import type { IDatabase, IRetrieveOutput, IRetrieveRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IRetrieveUserOutput extends IRetrieveOutput {
  _id: string
  name: string
  email: string
  username: string
}
export interface IRetrieveUserRepository extends IRetrieveRepository {
  handle(_id: string, options?: unknown): Promise<IRetrieveUserOutput>
}

export class RetrieveRepository implements IRetrieveUserRepository {
  public collection = collectionName

  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IRetrieveUserOutput> {
    const user = await this.database.collection(collectionName).retrieve(_id, options)
    return {
      _id: user._id,
      name: user.name as string,
      email: user.email as string,
      username: user.username as string,
    }
  }
}
