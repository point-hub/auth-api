import type { IAggregateOutput, IAggregateRepository, IDatabase, IPipeline, IQuery } from '@point-hub/papi'

import { collectionName } from '../entity'

export class RetrieveAllRepository implements IAggregateRepository {
  public collection = collectionName

  constructor(public database: IDatabase) {}

  async handle(query: IQuery, options?: unknown): Promise<IAggregateOutput> {
    const pipeline: IPipeline[] = []

    const filters = []
    if (query.filter?.search) {
      filters.push({ name: { $regex: query.filter?.search, $options: 'i' } })
    }

    if (filters.length) {
      pipeline.push({ $match: { $and: filters } })
    }
    const response = await this.database.collection(this.collection).aggregate(pipeline, query, options)

    return {
      data: response.data,
      pagination: response.pagination,
    }
  }
}
