import { type IClientEntity } from './interface'

export const collectionName = 'clients'

export class ClientEntity {
  constructor(public data: IClientEntity) {}
}
