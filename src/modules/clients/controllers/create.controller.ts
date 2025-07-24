import type { IController, IControllerInput } from '@point-hub/papi'

import { UniqueValidation } from '@/utils/unique-validation'
import { schemaValidation } from '@/utils/validation'

import { CreateClientRepository } from '../repositories/create.repository'
import { CreateClientUseCase } from '../use-cases/create.use-case'
import { generateClientId, generateClientSecret } from '../utils/hash'

export const createClientController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const createClientRepository = new CreateClientRepository(controllerInput.dbConnection, { session })
    const uniqueValidation = new UniqueValidation(controllerInput.dbConnection)
    // 3. handle business rules
    const response = await CreateClientUseCase.handle(controllerInput.httpRequest['body'], {
      createClientRepository,
      schemaValidation,
      uniqueValidation,
      generateClientId,
      generateClientSecret,
    })
    await session.commitTransaction()
    // 4. return response to client
    return {
      status: 201,
      json: response,
    }
  } catch (error) {
    await session?.abortTransaction()
    throw error
  } finally {
    await session?.endSession()
  }
}
