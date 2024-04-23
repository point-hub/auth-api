import { IApiKeyEntity } from './interface'

export const collectionName = 'api_keys'

export class ApiKeyEntity {
  constructor(public data: IApiKeyEntity) {}

  public generateCreatedDate() {
    this.data.created_date = new Date()
  }

  public generateUpdatedDate() {
    this.data.updated_date = new Date()
  }
}
