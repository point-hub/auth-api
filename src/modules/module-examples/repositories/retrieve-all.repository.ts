import type { IDatabase, IPagination, IPipeline, IQuery } from '@point-hub/papi'
import QueryString from 'qs'

import { throwApiError } from '@/utils/throw-api-error'

import { collectionName } from '../entity'
import { type IRetrieveModuleExampleOutput } from './retrieve.repository'

export interface IRetrieveAllModuleExampleRepository {
  handle(query: IQuery): Promise<IRetrieveAllModuleExampleOutput>
}

export interface IRetrieveAllModuleExampleOutput {
  data: IRetrieveModuleExampleOutput[]
  pagination: IPagination
}

export interface IModuleExampleQueryFilter {
  [key: string]: string | undefined
  all?: string
  name?: string
  age?: string
  nationality?: string
}

export interface IModuleExampleQuery extends IQuery {
  filter?: IModuleExampleQueryFilter
}

export class RetrieveAllModuleExampleRepository implements IRetrieveAllModuleExampleRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(query: IQuery): Promise<IRetrieveAllModuleExampleOutput> {
    const parsedQuery = QueryString.parse(query as Record<string, string>) as IModuleExampleQuery

    const pipeline: IPipeline[] = this.buildPipeline(parsedQuery)

    const response = await this.database.collection(collectionName).aggregate(pipeline, parsedQuery, this.options)

    return {
      data: response.data as unknown as IRetrieveModuleExampleOutput[],
      pagination: response.pagination,
    }
  }

  private buildPipeline(query: IModuleExampleQuery): IPipeline[] {
    const filters: Record<string, unknown>[] = []
    const { filter } = query

    // General search across multiple fields
    if (filter?.all) {
      const searchRegex = { $regex: filter.all, $options: 'i' }
      const fields = ['name', 'age', 'nationality.label']
      filters.push({
        $or: fields.map((field) => ({ [field]: searchRegex })),
      })
    }

    // Filter specific field
    this.addRegexFilter(filters, 'name', filter?.name)
    this.addRegexFilter(filters, 'nationality.label', filter?.nationality)

    // Apply numeric filter using the helper function
    this.addNumberFilter(filters, 'age', filter?.age)

    return filters.length > 0 ? [{ $match: { $and: filters } }] : []
  }

  private addRegexFilter(filters: Record<string, unknown>[], field: string, value?: string) {
    if (value?.trim()) {
      filters.push({ [field]: { $regex: value.trim(), $options: 'i' } })
    }
  }

  private addNumberFilter(filters: Record<string, unknown>[], field: string, value?: string) {
    // Number('') => 0 can lead to false positives (e.g., filtering age = 0 when input is actually an empty string).
    if (typeof value !== 'string' || value.trim() === '') return

    const constraints = this.parseComparisons(value)

    const mongoFilter: Record<string, number> = {}

    if (constraints.eq !== undefined) {
      filters.push({ [field]: constraints.eq })
      return
    }

    if (constraints.gt !== undefined) mongoFilter['$gt'] = constraints.gt
    if (constraints.gte !== undefined) mongoFilter['$gte'] = constraints.gte
    if (constraints.lt !== undefined) mongoFilter['$lt'] = constraints.lt
    if (constraints.lte !== undefined) mongoFilter['$lte'] = constraints.lte

    if (Object.keys(mongoFilter).length > 0) {
      filters.push({ [field]: mongoFilter })
    }
  }

  /**
   * Parses a comparison expression like ">10<20" or "42" into structured bounds.
   *
   * Supported operators:
   * - '>'  → gt
   * - '>=' → gte
   * - '<'  → lt
   * - '<=' → lte
   * - Number only → eq
   *
   * ModuleExamples:
   * - ">10<20"     → { gt: 10, lt: 20 }
   * - "<=100>=50"  → { lte: 100, gte: 50 }
   * - "2"          → { eq: 2 }
   *
   * Rules:
   * - Only one lower-bound ('>' or '>=') allowed
   * - Only one upper-bound ('<' or '<=') allowed
   * - Expression must be fully valid (no leftover characters)
   * - Spaces are ignored
   *
   * @param expr - The input string to parse.
   * @returns A structured object representing the constraints.
   * @throws {Error} If input is malformed or contains conflicting operators.
   */
  private parseComparisons(expr: string): {
    gt?: number
    gte?: number
    lt?: number
    lte?: number
    eq?: number
  } {
    const cleanedExpr = expr.replace(/\s+/g, '')

    // If it's a plain number, return equality
    if (/^\d+$/.test(cleanedExpr)) {
      return { eq: parseInt(cleanedExpr, 10) }
    }

    const regex = /(<=|>=|<|>)(\d+)/g
    const result: { gt?: number; gte?: number; lt?: number; lte?: number; eq?: number } = {}

    let matchedStr = ''
    let hasLowerBound = false
    let hasUpperBound = false

    let match
    while ((match = regex.exec(cleanedExpr)) !== null) {
      const [full, operator, valueStr] = match
      const value = parseInt(valueStr, 10)
      matchedStr += full

      switch (operator) {
        case '>':
        case '>=':
          if (hasLowerBound) {
            throwApiError('Bad Request', { message: "Only one lower-bound operator allowed (either '>' or '>=')." })
          }
          result[operator === '>' ? 'gt' : 'gte'] = value
          hasLowerBound = true
          break

        case '<':
        case '<=':
          if (hasUpperBound) {
            throwApiError('Bad Request', { message: "Only one upper-bound operator allowed (either '<' or '<=')." })
          }
          result[operator === '<' ? 'lt' : 'lte'] = value
          hasUpperBound = true
          break
      }
    }

    if (cleanedExpr.length > 0 && matchedStr !== cleanedExpr) {
      throwApiError('Bad Request', { message: `Malformed input: '${expr}' is not a number` })
    }

    return result
  }
}
