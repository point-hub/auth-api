import type { IRetrieveOutput, IRetrieveRepository } from '@point-hub/papi'

export interface IInput {
  _id: string
}
export interface IDeps {
  retrieveRepository: IRetrieveRepository
}
export interface IOptions {}

export class RetrieveOAuth2UseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IRetrieveOutput> {
    const response = await deps.retrieveRepository.handle(input._id, options)
    return {
      _id: response._id,
      name: response.name,
      authorized_urls: response.authorized_urls,
      redirect_urls: response.redirect_urls,
      client_id: response.client_id,
      client_secret: response.client_secret,
      prefix_client_secret: response.prefix_client_secret,
      created_date: response.created_date,
      updated_date: response.updated_date,
    }
  }
}
