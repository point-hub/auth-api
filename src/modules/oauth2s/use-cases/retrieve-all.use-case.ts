import type { IQuery, IRetrieveAllOutput, IRetrieveAllRepository, IRetrieveRepository } from '@point-hub/papi'

export interface IInput {
  query: IQuery
}
export interface IDeps {
  retrieveAllRepository: IRetrieveAllRepository
  retrieveRepository: IRetrieveRepository
}
export interface IOptions {}

export class RetrieveAllOAuth2UseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IRetrieveAllOutput> {
    //
    // const authUser = await deps.retrieveRepository.handle(input.query, options)
    const response = await deps.retrieveAllRepository.handle(input.query, options)
    return {
      data: response.data,
      pagination: response.pagination,
    }
  }
}
