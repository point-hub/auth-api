import { type ICustomerEntity } from './interface'

export const collectionName = 'customers'

export class CustomerEntity {
  constructor(public data: ICustomerEntity) {}
}
