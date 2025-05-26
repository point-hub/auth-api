import type { ISchemaValidation } from '@point-hub/papi'

import type { IUniqueValidation } from '@/utils/unique-validation'
import type { IValidation } from '@/utils/validation'

import { UserEntity } from '../entity'
import type { IUpdateUserRepository } from '../repositories/update.repository'

export interface IInput {
  _id: string
  data: {
    password: string
  }
}

export interface IDeps {
  schemaValidation: ISchemaValidation
  updateUserRepository: IUpdateUserRepository
  uniqueValidation: IUniqueValidation
  hashPassword(password: string): Promise<string>
  updatePasswordValidation: IValidation
}

export interface IOutput {
  matched_count: number
  modified_count: number
}

export class UpdatePasswordUserUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input.data, deps.updatePasswordValidation)
    // 2. define entity
    const userEntity = new UserEntity({
      password: await deps.hashPassword(input.data.password),
    })
    // 3. database operation
    const response = await deps.updateUserRepository.handle(input._id, userEntity.data)
    // 4. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
