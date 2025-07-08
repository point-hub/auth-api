import { objClean } from '@point-hub/express-utils'
import type { IController, IControllerInput } from '@point-hub/papi'

import { UniqueValidation } from '@/utils/unique-validation'
import { schemaValidation } from '@/utils/validation'

import { CreateCustomerRepository } from '../repositories/create.repository'
import { CreateCustomerUseCase } from '../use-cases/create.use-case'

export const createCustomerController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const createCustomerRepository = new CreateCustomerRepository(controllerInput.dbConnection, { session })
    const uniqueValidation = new UniqueValidation(controllerInput.dbConnection)
    // 3. handle business rules
    const response = await CreateCustomerUseCase.handle(controllerInput.httpRequest['body'], {
      createCustomerRepository,
      schemaValidation,
      uniqueValidation,
      objClean,
    })
    await session.commitTransaction()
    // 4. return response to client
    return {
      status: 201,
      json: {
        inserted_id: response.inserted_id,
      },
    }
  } catch (error) {
    await session?.abortTransaction()
    throw error
  } finally {
    await session?.endSession()
  }
}
