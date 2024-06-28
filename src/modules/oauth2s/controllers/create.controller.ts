import { objClean, tokenGenerate, tokenSha256 } from '@point-hub/express-utils'
import type { IController, IControllerInput } from '@point-hub/papi'

import { schemaValidation } from '@/utils/validation'

import { CreateRepository } from '../repositories/create.repository'
import { CreateOAuth2UseCase } from '../use-cases/create.use-case'
import { generateClientId } from '../utils/generate-client-id'

export const createOAuth2Controller: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const createRepository = new CreateRepository(controllerInput.dbConnection)
    // 3. handle business rules
    const response = await CreateOAuth2UseCase.handle(
      controllerInput.httpRequest.body,
      {
        cleanObject: objClean,
        createRepository,
        schemaValidation,
        generateClientId,
        generateClientSecret: tokenGenerate,
        hashClientSecret: tokenSha256,
      },
      { session },
    )
    await session.commitTransaction()
    // 4. return response to client
    return {
      status: 201,
      json: {
        inserted_id: response.inserted_id,
        client_id: response.client_id,
        client_secret: response.client_secret,
      },
    }
  } catch (error) {
    await session?.abortTransaction()
    throw error
  } finally {
    await session?.endSession()
  }
}
