import type { ICreateOutput, ICreateRepository, IRetrieveRepository, ISchemaValidation } from '@point-hub/papi'

import pointhubConfig from '@/config/pointhub'
import { renderHbsTemplate, sendMail } from '@/utils/email'
import { throwApiError } from '@/utils/throw-api-error'

import { UserEntity } from '../entity'
import type { IRetrieveUserRepository } from '../repositories/retrieve.repository'
import { signupValidation } from '../validations/signup.validation'

export interface IOutput {
  inserted_id: string
  user_info: {
    name: string
    username: string
    email: string
  }
}
export interface IInput {
  pointhubSecret: string
  data: {
    name: string
    username: string
    email: string
    password: string
  }
}
export interface IDeps {
  signupRepository: ICreateRepository
  retrieveRepository: IRetrieveUserRepository
  createOrganizationRepository: ICreateRepository
  createProjectRepository: ICreateRepository
  cleanObject(object: object): object
  schemaValidation: ISchemaValidation
  hashPassword(password: string): Promise<string>
  sendEmail(html: string, to: string, subject: string): void
  renderHbsTemplate(template: string, context: Record<string, unknown>): Promise<string>
  generateVerificationLink(): string
  generateVerificationCode(): string
}
export interface IOptions {
  session?: unknown
}

export class SignupUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, signupValidation)
    // 2. verify pointhub secret
    if (pointhubConfig.secret !== input.pointhubSecret) {
      throwApiError('Forbidden')
    }
    // 3. define entity
    const linkVerification = deps.generateVerificationLink()
    const codeVerification = deps.generateVerificationCode()
    const userEntity = new UserEntity({
      name: input.data.name,
      username: input.data.username,
      email: input.data.email,
      password: input.data.password ? await deps.hashPassword(input.data.password) : '',
      email_verification_code: codeVerification,
    })
    userEntity.generateCreatedDate()
    const cleanEntity = deps.cleanObject(userEntity.data)
    // 4. database operation
    const responseSignup = await deps.signupRepository.handle(cleanEntity, options)
    // 5. send welcome email
    const compiledTemplate = await renderHbsTemplate('users/emails/email-verification.hbs', {
      name: userEntity.data.name,
      linkVerification: linkVerification,
      codeVerification: codeVerification,
    })
    sendMail(compiledTemplate, userEntity.data.email as string, 'Welcome to Pointhub')
    // 6. get user recorded data
    const responseUser = await deps.retrieveRepository.handle(responseSignup.inserted_id, options)
    // 7. return response
    return {
      inserted_id: responseSignup.inserted_id,
      user_info: {
        name: responseUser.name,
        username: responseUser.username,
        email: responseUser.email,
      },
    }
  }
}
