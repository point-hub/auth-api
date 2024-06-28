import { objClean } from '@point-hub/express-utils'
import { type IController, type IControllerInput } from '@point-hub/papi'

import { GoogleAuth } from '@/utils/google-auth'
import { throwApiError } from '@/utils/throw-api-error'
import { schemaValidation } from '@/utils/validation'

import { RetrieveAllRepository } from '../repositories/retrieve-all.repository'
import { SigninUseCase } from '../use-cases/signin.use-case'
export const googleAuthCallbackController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    // 3. handle business rules
    const qs = new URLSearchParams(controllerInput.httpRequest.query)
    const googleAuth = new GoogleAuth()
    const tokens = await googleAuth.getToken(qs.get('code') as string)
    const tokenInfo = await googleAuth.oAuth2Client.getTokenInfo(tokens.tokens.access_token as string)
    const userInfo = await googleAuth.userInfo()

    await session.commitTransaction()
    // 4. return response to client
    return {
      status: 200,
      json: {
        tokens: tokens,
        userInfo: userInfo,
      },
    }
  } catch (error) {
    await session?.abortTransaction()
    throw error
  } finally {
    await session?.endSession()
  }
}
