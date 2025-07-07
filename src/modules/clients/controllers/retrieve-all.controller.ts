import type { IController, IControllerInput } from '@point-hub/papi'

import { RetrieveAllClientRepository } from '../repositories/retrieve-all.repository'
import { RetrieveAllClientUseCase } from '../use-cases/retrieve-all.use-case'

export const retrieveAllClientController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const retrieveAllClientRepository = new RetrieveAllClientRepository(controllerInput.dbConnection)
    // 3. handle business rules
    const response = await RetrieveAllClientUseCase.handle(
      { query: controllerInput.httpRequest['query'] },
      { retrieveAllClientRepository },
    )
    await session.commitTransaction()
    // 4. return response to client
    return {
      status: 200,
      json: {
        data: response.data,
        pagination: response.pagination,
      },
    }
  } catch (error) {
    await session?.abortTransaction()
    throw error
  } finally {
    await session?.endSession()
  }
}
