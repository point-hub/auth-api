import { type IController, type IControllerInput } from '@point-hub/papi'

import authConfig from '@/config/auth'
import { throwApiError } from '@/utils/throw-api-error'
import { schemaValidation } from '@/utils/validation'

import { RetrieveAuthUserRepository } from '../repositories/retrieve-auth-user.repository'
import { VerifyTokenUseCase } from '../use-cases/verify-token.use-case'
import { verifyToken } from '../utils/jwt'

export const verifyTokenController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const retrieveAuthUserRepository = new RetrieveAuthUserRepository(controllerInput.dbConnection)
    // 3. handle business rules
    console.log(controllerInput.httpRequest)
    const response = await VerifyTokenUseCase.handle(
      {
        token: controllerInput.httpRequest.signedCookies.POINTHUB_ACCESS,
        secret: authConfig.secret,
        project_id: controllerInput.httpRequest.query.project_id,
      },
      {
        schemaValidation,
        throwApiError,
        retrieveAuthUserRepository,
        verifyToken,
      },
      { session },
    )
    console.log(response)
    await session.commitTransaction()
    // 4. return response to client
    const date = new Date()
    date.setDate(date.getDate() + 60)
    return {
      status: 200,
      json: {
        _id: response._id,
        email: response.email,
        username: response.username,
        name: response.name,
        organization: response.organization,
        project: response.project,
      },
    }
  } catch (error) {
    await session?.abortTransaction()
    throw error
  } finally {
    await session?.endSession()
  }
}
