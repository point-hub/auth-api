import type { ICreateOutput, ICreateRepository, ISchemaValidation } from '@point-hub/papi'

import { ApplicationEntity } from '../entity'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  name?: string
  support_email?: string
  developer_email?: string
  homepage_link?: string
  privacy_link?: string
  terms_link?: string
  authorized_domains?: string[]
}
export interface IDeps {
  cleanObject(object: object): object
  createRepository: ICreateRepository
  schemaValidation: ISchemaValidation
}
export interface IOptions {
  session?: unknown
}

export class CreateApplicationUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<ICreateOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, createValidation)
    // 2. define entity
    const entity = new ApplicationEntity({
      name: input.name,
      support_email: input.support_email,
      developer_email: input.developer_email,
      homepage_link: input.homepage_link,
      privacy_link: input.privacy_link,
      terms_link: input.terms_link,
      authorized_domains: input.authorized_domains,
      created_by: '',
    })
    entity.generateCreatedDate()
    const cleanEntity = deps.cleanObject(entity.data)
    // 3. database operation
    const response = await deps.createRepository.handle(cleanEntity, options)
    return { inserted_id: response.inserted_id }
  }
}
