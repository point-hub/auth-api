import type { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import type { IUniqueValidation } from '@/utils/unique-validation'

import { UserEntity } from '../entity'
import type { IUpdateUserRepository } from '../repositories/update.repository'
import { updateValidation } from '../validations/update.validation'

export interface IInput {
  _id: string
  data: {
    email?: string
  }
}

export interface IDeps {
  schemaValidation: ISchemaValidation
  updateUserRepository: IUpdateUserRepository
  uniqueValidation: IUniqueValidation
}

export interface IOutput {
  matched_count: number
  modified_count: number
}

export class UpdateEmailUserUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input.data, updateValidation)
    // 2. define entity
    const userEntity = new UserEntity({ email: input.data.email })
    userEntity.trimmedEmail()
    // 3. validate unique
    await deps.uniqueValidation.handle(
      'users',
      {
        match: { trimmed_email: input.data.email },
        replaceErrorAttribute: { trimmed_email: 'email' },
      },
      input._id,
    )
    // 4. database operation
    const response = await deps.updateUserRepository.handle(input._id, userEntity.data)
    // 5. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
