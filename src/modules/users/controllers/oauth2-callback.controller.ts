import { objClean } from '@point-hub/express-utils'
import { type IController, type IControllerInput } from '@point-hub/papi'

import { throwApiError } from '@/utils/throw-api-error'
import { schemaValidation } from '@/utils/validation'

import { RetrieveAllRepository } from '../repositories/retrieve-all.repository'
import { SigninUseCase } from '../use-cases/signin.use-case'
import { generateAccessToken, generateRefreshToken } from '../utils/jwt'

export const oAuth2CallbackController: IController = async (controllerInput: IControllerInput) => {
  console.log('asda')
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    // 3. handle business rules
    await session.commitTransaction()
    // 4. return response to client
    const date = new Date()
    date.setDate(date.getDate() + 60)
    return {
      status: 200,
      redirect: 'http://localhost:3000',
    }
  } catch (error) {
    await session?.abortTransaction()
    throw error
  } finally {
    await session?.endSession()
  }
}
