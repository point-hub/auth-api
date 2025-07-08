import { objClean } from '@point-hub/express-utils'
import type { IController, IControllerInput } from '@point-hub/papi'

import { UniqueValidation } from '@/utils/unique-validation'
import { schemaValidation } from '@/utils/validation'

import { CreateManyCustomerRepository } from '../repositories/create-many.repository'
import { CreateManyCustomerUseCase } from '../use-cases/create-many.use-case'

export const createManyCustomerController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const createManyCustomerRepository = new CreateManyCustomerRepository(controllerInput.dbConnection, { session })
    const uniqueValidation = new UniqueValidation(controllerInput.dbConnection)
    // 3. handle business rules
    const response = await CreateManyCustomerUseCase.handle(controllerInput.httpRequest['body'], {
      schemaValidation,
      createManyCustomerRepository,
      uniqueValidation,
      objClean,
    })
    await session.commitTransaction()
    // 4. return response to client
    return {
      status: 201,
      json: {
        inserted_ids: response.inserted_ids,
        inserted_count: response.inserted_count,
      },
    }
  } catch (error) {
    await session?.abortTransaction()
    throw error
  } finally {
    await session?.endSession()
  }
}
