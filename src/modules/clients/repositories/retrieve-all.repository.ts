import type { IDatabase, IPagination, IPipeline, IQuery } from '@point-hub/papi'
import { BaseMongoDBQueryFilters } from '@point-hub/papi'
import QueryString from 'qs'

import { collectionName } from '../entity'
import { type IRetrieveClientOutput } from './retrieve.repository'

export interface IRetrieveAllClientRepository {
  handle(query: IQuery): Promise<IRetrieveAllClientOutput>
}

export interface IRetrieveAllClientOutput {
  data: IRetrieveClientOutput[]
  pagination: IPagination
}

export interface IClientQueryFilter {
  all?: string
  name?: string
  client_id?: string
}

export interface IClientQuery extends IQuery {
  filter?: IClientQueryFilter
}

export class RetrieveAllClientRepository implements IRetrieveAllClientRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(query: IQuery): Promise<IRetrieveAllClientOutput> {
    const parsedQuery = QueryString.parse(query as Record<string, string>) as IClientQuery

    const pipeline: IPipeline[] = this.buildPipeline(parsedQuery)

    const response = await this.database.collection(collectionName).aggregate(pipeline, parsedQuery, this.options)

    return {
      data: response.data as unknown as IRetrieveClientOutput[],
      pagination: response.pagination,
    }
  }

  private buildPipeline(query: IClientQuery): IPipeline[] {
    const filters: Record<string, unknown>[] = []
    const { filter } = query

    // General search across multiple fields
    if (filter?.all) {
      const searchRegex = { $regex: filter.all, $options: 'i' }
      const fields = ['name', 'client_id']
      filters.push({
        $or: fields.map((field) => ({ [field]: searchRegex })),
      })
    }

    // Filter specific field
    BaseMongoDBQueryFilters.addRegexFilter(filters, 'name', filter?.name)
    BaseMongoDBQueryFilters.addRegexFilter(filters, 'client_id', filter?.client_id)

    return filters.length > 0 ? [{ $match: { $and: filters } }] : []
  }
}
