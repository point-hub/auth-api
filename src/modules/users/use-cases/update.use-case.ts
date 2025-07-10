import type { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import type { IUniqueValidation } from '@/utils/unique-validation'

import { UserEntity } from '../entity'
import type { IUpdateUserRepository } from '../repositories/update.repository'
import { updateValidation } from '../validations/update.validation'

export interface IInput {
  _id: string
  data: {
    name?: string
    username?: string
    email?: string
  }
}

export interface IDeps {
  schemaValidation: ISchemaValidation
  updateUserRepository: IUpdateUserRepository
  uniqueValidation: IUniqueValidation
  objClean: IObjClean
}

export interface IOutput {
  matched_count: number
  modified_count: number
}

export class UpdateUserUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate unique
    await deps.uniqueValidation.handle('users', {
      match: { trimmed_username: input.data.username },
      replaceErrorAttribute: { trimmed_username: 'username' },
      excludeId: input._id,
    })
    await deps.uniqueValidation.handle('users', {
      match: { trimmed_email: input.data.email },
      replaceErrorAttribute: { trimmed_email: 'email' },
      excludeId: input._id,
    })
    // 2. validate schema
    await deps.schemaValidation(input.data, updateValidation)
    // 3. define entity
    const userEntity = new UserEntity({
      email: input.data.email,
      username: input.data.username,
      name: input.data.name,
    })
    userEntity.trimmedEmail()
    userEntity.trimmedUsername()
    userEntity.data = deps.objClean(userEntity.data)
    // 4. database operation
    const response = await deps.updateUserRepository.handle(input._id, userEntity.data)
    // 5. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
