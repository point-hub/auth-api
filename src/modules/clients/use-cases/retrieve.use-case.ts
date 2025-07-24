import type { IRetrieveClientRepository } from '../repositories/retrieve.repository'

export interface IInput {
  _id: string
}

export interface IDeps {
  retrieveClientRepository: IRetrieveClientRepository
}

export interface IOutput {
  _id: string
  name: string
  client_id: string
  client_secret: string
  authorized_origins: string[]
  authorized_redirect_uris: string[]
  created_at: Date
  updated_at: Date
}

export class RetrieveClientUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveClientRepository.handle(input._id)
    // 2. output
    return {
      _id: response._id,
      name: response.name,
      client_id: response.client_id,
      client_secret: response.client_secret,
      authorized_origins: response.authorized_origins,
      authorized_redirect_uris: response.authorized_redirect_uris,
      created_at: response.created_at,
      updated_at: response.updated_at,
    }
  }
}
