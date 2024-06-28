import { objClean, tokenGenerate } from '@point-hub/express-utils'
import type { IController, IControllerInput } from '@point-hub/papi'

import { renderHbsTemplate, sendMail } from '@/utils/email'
import { schemaValidation } from '@/utils/validation'

import { SignupRepository } from '../repositories/signup.repository'
import { SignupUseCase } from '../use-cases/signup.use-case'
import { generateVerificationLink } from '../utils/generate-verification-link'

export const signupController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const signupRepository = new SignupRepository(controllerInput.dbConnection)
    // 3. handle business rules
    const responseCreate = await SignupUseCase.handle(
      controllerInput.httpRequest.body,
      {
        signupRepository,
        cleanObject: objClean,
        schemaValidation,
        hashPassword: Bun.password.hash,
        renderHbsTemplate: renderHbsTemplate,
        sendEmail: sendMail,
        generateVerificationCode: tokenGenerate,
        generateVerificationLink: generateVerificationLink,
      },
      { session },
    )

    await session.commitTransaction()
    // 4. return response to client
    return {
      status: 201,
      json: {
        inserted_id: responseCreate.inserted_id,
      },
    }
  } catch (error) {
    await session?.abortTransaction()
    throw error
  } finally {
    await session?.endSession()
  }
}
