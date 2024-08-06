import { IOAuthClientEntity } from './interface'

export const collectionName = 'oauth_clients'

export class OAuthClientEntity {
  constructor(public data: IOAuthClientEntity) {}

  public generateCreatedDate() {
    this.data.created_date = new Date()
  }

  public generateUpdatedDate() {
    this.data.updated_date = new Date()
  }
}
