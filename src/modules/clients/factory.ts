import { faker } from '@faker-js/faker'
import { BaseFactory, type IDatabase } from '@point-hub/papi'

import { type IClientEntity } from './interface'
import { CreateClientRepository } from './repositories/create.repository'
import { CreateManyClientRepository } from './repositories/create-many.repository'

export default class ClientFactory extends BaseFactory<IClientEntity> {
  constructor(public dbConnection: IDatabase) {
    super()
  }

  definition() {
    return {
      name: faker.person.fullName(),
      created_date: new Date(),
    }
  }

  async create() {
    const createRepository = new CreateClientRepository(this.dbConnection)
    return await createRepository.handle(this.makeOne())
  }

  async createMany(count: number) {
    const createManyRepository = new CreateManyClientRepository(this.dbConnection)
    return await createManyRepository.handle(this.makeMany(count))
  }
}
