import type { IRetrieveUserRepository } from '../repositories/retrieve.repository'

export interface IInput {
  _id: string
}

export interface IDeps {
  retrieveUserRepository: IRetrieveUserRepository
}

export interface IOutput {
  _id: string
  name: string
  username: string
  email: string
  role: string
  created_at: Date
  updated_at: Date
}

export class RetrieveUserUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveUserRepository.handle(input._id)
    // 2. output
    return {
      _id: response._id,
      name: response.name,
      username: response.username,
      email: response.email,
      role: response.email,
      created_at: response.created_at,
      updated_at: response.updated_at,
    }
  }
}
