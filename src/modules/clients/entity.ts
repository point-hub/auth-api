import { objClean } from '@point-hub/express-utils'

import { type IClientEntity } from './interface'

export const collectionName = 'clients'

export class ClientEntity {
  constructor(public data: IClientEntity) {}

  cleanData() {
    this.data = objClean(this.data)
  }
}
