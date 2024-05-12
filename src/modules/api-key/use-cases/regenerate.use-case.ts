import type { IUpdateOutput, IUpdateRepository } from '@point-hub/papi'

import { ApiKeyEntity } from '../entity'

export interface IInput {
  _id: string
}
export interface IDeps {
  cleanObject(object: object): object
  regenerateRepository: IUpdateRepository
  generateApiKey(): string
  hashApiKey(string: string): string
}
export interface IOptions {
  session?: unknown
}

export class RegenerateApiKeyUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IUpdateOutput> {
    // 1. define entity
    const apiKey = deps.generateApiKey()
    const hashedApiKey = deps.hashApiKey(apiKey)
    const apiKeyEntity = new ApiKeyEntity({
      prefix_api_key: apiKey.substring(0, 6),
      hashed_api_key: hashedApiKey,
    })
    apiKeyEntity.generateUpdatedDate()
    const cleanEntity = deps.cleanObject(apiKeyEntity.data)
    // 2. database operation
    const response = await deps.regenerateRepository.handle(input._id, cleanEntity, options)
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
