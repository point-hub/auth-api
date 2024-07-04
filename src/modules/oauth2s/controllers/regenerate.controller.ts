import { objClean, tokenGenerate, tokenSha256 } from '@point-hub/express-utils'
import type { IController, IControllerInput } from '@point-hub/papi'

import { RegenerateRepository } from '../repositories/regenerate.repository'
import { RegenerateClientSecretUseCase } from '../use-cases/regenerate.use-case'

export const regenerateOAuth2Controller: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const regenerateRepository = new RegenerateRepository(controllerInput.dbConnection)
    // 3. handle business rules
    const response = await RegenerateClientSecretUseCase.handle(
      { _id: controllerInput.httpRequest.params.id },
      {
        cleanObject: objClean,
        regenerateRepository,
        generateClientSecret: tokenGenerate,
        hashClientSecret: tokenSha256,
      },
    )
    await session.commitTransaction()
    // 4. return response to client
    return {
      status: 200,
      json: {
        matched_count: response.matched_count,
        modified_count: response.modified_count,
        client_secret: response.client_secret,
        prefix_client_secret: response.prefix_client_secret,
      },
    }
  } catch (error) {
    await session?.abortTransaction()
    throw error
  } finally {
    await session?.endSession()
  }
}
