import type { IController, IControllerInput } from '@point-hub/papi'

import { schemaValidation } from '@/utils/validation'

import { DeleteManyClientRepository } from '../repositories/delete-many.repository'
import { DeleteManyClientUseCase } from '../use-cases/delete-many.use-case'

export const deleteManyClientController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const deleteManyClientRepository = new DeleteManyClientRepository(controllerInput.dbConnection, { session })
    // 3. handle business rules
    const response = await DeleteManyClientUseCase.handle(
      { ids: controllerInput.httpRequest['body'].ids },
      { schemaValidation, deleteManyClientRepository },
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
