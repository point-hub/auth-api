import type { IDatabase, IDocument } from '@point-hub/papi'

import { throwApiError } from './throw-api-error'

/**
 * Filter definition for checking uniqueness in a collection.
 */
export interface IFilter {
  /**
   * The document fields to match for uniqueness checking.
   */
  match: IDocument

  /**
   * Optional map to replace error field names in the response.
   * Useful when internal field names differ from user-facing field names.
   */
  replaceErrorAttribute?: IDocument

  /**
   * Optional ID to exclude from the uniqueness check (e.g., when updating a record).
   */
  excludeId?: string
  /**
   * Optional dynamic path prefix like "examples", "users"
   */
  pathPrefix?: string
}

/**
 * Interface for uniqueness validation logic.
 */
export interface IUniqueValidation {
  /**
   * Validates that no other documents match the given filter in the collection.
   *
   * @param collectionName - The name of the collection to validate against.
   * @param filter - A single filter defining which fields must be unique.
   * @throws Will throw an API error with status 422 if duplicates are found.
   */
  handle(collectionName: string, filter: IFilter): Promise<void>

  /**
   * Validates that no other documents match any of the given filters in the collection.
   *
   * @param collectionName - The name of the collection to validate against.
   * @param filters - An array of filters to check for uniqueness.
   * @throws Will throw an API error with status 422 if duplicates are found.
   */
  handleMany(collectionName: string, filters: IFilter[]): Promise<void>
}

/**
 * UniqueValidation class performs uniqueness checks across documents
 * in a Mongo-like collection, throwing validation errors if duplicates exist.
 */
export class UniqueValidation implements IUniqueValidation {
  /**
   * Constructs a new UniqueValidation instance.
   *
   * @param database - The database interface to operate on.
   * @param options - Optional parameters for the database query.
   */
  constructor(
    public database: IDatabase,
    public options?: unknown,
  ) {}

  /**
   * Validates a single filter for uniqueness by delegating to handleMany.
   *
   * @param collectionName - The collection to check.
   * @param filter - A single uniqueness filter.
   * @throws API error if a matching document exists (excluding specified ID).
   */
  async handle(collectionName: string, filter: IFilter): Promise<void> {
    await this.handleMany(collectionName, [filter])
  }

  /**
   * Validates multiple filters for uniqueness using a single query with `$or`.
   *
   * @param collectionName - The collection to check.
   * @param filters - An array of filters, each specifying match conditions and optional ID exclusions.
   * @throws API error if any filter has a match in the collection.
   */
  async handleMany(collectionName: string, filters: IFilter[]): Promise<void> {
    if (!filters.length) return

    // Build $or conditions for uniqueness check
    const orConditions = filters.map((filter) => {
      const condition = { ...filter.match }
      if (filter.excludeId) {
        condition['_id'] = { $ne: filter.excludeId }
      }
      return condition
    })

    const response = await this.database.collection(collectionName).retrieveAll(
      {
        filter: { $or: orConditions },
      },
      this.options,
    )

    if (!response.data.length) return

    const errors: Record<string, string[]> = {}

    // Go through each filter and check if it matches any retrieved document
    for (const [index, filter] of filters.entries()) {
      const { match, excludeId, replaceErrorAttribute, pathPrefix = '' } = filter

      const matchedDoc = response.data.find((doc) => {
        const isMatch = Object.entries(match).every(([key, val]) => doc[key] === val)
        const isExcluded = excludeId && doc._id === excludeId
        return isMatch && !isExcluded
      })

      if (matchedDoc) {
        const keys = Object.keys(match)
        const keyString = keys.join(', ')
        const message = keys.length > 1 ? `The combination of ${keyString} is exists.` : `The ${keyString} is exists.`

        for (const key of keys) {
          const displayKey = replaceErrorAttribute?.[key] || key
          const errorKey = pathPrefix ? `${pathPrefix}.${index}.${displayKey}` : `${displayKey}`

          if (!errors[errorKey]) {
            errors[errorKey] = []
          }

          if (!errors[errorKey].includes(message)) {
            errors[errorKey].push(message)
          }
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      throwApiError(422, { errors })
    }
  }
}
