import type { IController, IControllerInput } from '@point-hub/papi'

import { UniqueValidation } from '@/utils/unique-validation'
import { schemaValidation } from '@/utils/validation'

import { UpdateClientRepository } from '../repositories/update.repository'
import { UpdateClientUseCase } from '../use-cases/update.use-case'
import { generateClientId, generateClientSecret } from '../utils/hash'

export const updateClientController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const updateClientRepository = new UpdateClientRepository(controllerInput.dbConnection, { session })
    const uniqueValidation = new UniqueValidation(controllerInput.dbConnection)
    // 3. handle business rules
    const response = await UpdateClientUseCase.handle(
      {
        _id: controllerInput.httpRequest['params'].id,
        data: controllerInput.httpRequest['body'],
      },
      { schemaValidation, updateClientRepository, uniqueValidation, generateClientId, generateClientSecret },
    )
    await session.commitTransaction()
    // 4. return response to client
    return {
      status: 200,
      json: response,
    }
  } catch (error) {
    await session?.abortTransaction()
    throw error
  } finally {
    await session?.endSession()
  }
}
