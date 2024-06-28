import { IOAuth2Entity } from './interface'

export const collectionName = 'oauth2s'

export class OAuth2Entity {
  constructor(public data: IOAuth2Entity) {}

  public generateCreatedDate() {
    this.data.created_date = new Date()
  }

  public generateUpdatedDate() {
    this.data.updated_date = new Date()
  }
}
