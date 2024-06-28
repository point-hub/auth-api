import { objClean } from '@point-hub/express-utils'
import { type IController, type IControllerInput } from '@point-hub/papi'

import { Github } from '@/utils/github-auth'
import { throwApiError } from '@/utils/throw-api-error'
import { schemaValidation } from '@/utils/validation'

import { RetrieveAllRepository } from '../repositories/retrieve-all.repository'
import { SigninUseCase } from '../use-cases/signin.use-case'
export const githubAuthController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    // 3. handle business rules
    const github = new Github()
    const url = github.getAuthUrl()

    await session.commitTransaction()
    // 4. return response to client
    return {
      status: 200,
      json: {
        url: url,
      },
    }
  } catch (error) {
    await session?.abortTransaction()
    throw error
  } finally {
    await session?.endSession()
  }
}
