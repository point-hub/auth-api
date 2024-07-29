import type { IController, IControllerInput } from '@point-hub/papi'

import { VerifyTokenUseCase } from '@/modules/users/use-cases/verify-token.use-case'
import { verifyToken } from '@/modules/users/utils/jwt'
import { throwApiError } from '@/utils/throw-api-error'
import { schemaValidation } from '@/utils/validation'

import { RetrieveRepository } from '../repositories/retrieve.repository'
import { RetrieveAllRepository } from '../repositories/retrieve-all.repository'
import { RetrieveAllOAuth2UseCase } from '../use-cases/retrieve-all.use-case'
export const retrieveAllOAuth2Controller: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const retrieveRepository = new RetrieveRepository(controllerInput.dbConnection)
    const retrieveAllRepository = new RetrieveAllRepository(controllerInput.dbConnection)
    // 0. verify token
    const v = verifyToken(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhdXRoLnBvaW50aHViLm5ldCIsInN1YiI6IjY2ODc2YmQyYjMzYjliZjY1ODljMDYzNSIsImlhdCI6MTcyMDQzMzczMjUyMCwiZXhwIjoxNzIwNTIwMTMyNTIwfQ.7YVSh0sBppWf2OK5TcksoIoqVk4VLPYVtGgqLANRgqI',
      'ak089sItJAuYxhvcP',
    )
    console.log('verify token is ', v)
    // VerifyTokenUseCase.handle(
    //   { token: '', secret: '' },
    //   {
    //     retrieveRepository,
    //     throwApiError,
    //     schemaValidation,
    //     verifyToken,
    //     decodeToken,
    //   },
    // )
    // 3. handle business rules
    const response = await RetrieveAllOAuth2UseCase.handle(
      { query: controllerInput.httpRequest.query },
      { retrieveAllRepository, retrieveRepository },
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
