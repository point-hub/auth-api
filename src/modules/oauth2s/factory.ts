import { faker } from '@faker-js/faker'
import { BaseFactory, type IDatabase } from '@point-hub/papi'

import { IOAuth2Entity } from './interface'
import { CreateRepository } from './repositories/create.repository'
import { CreateManyRepository } from './repositories/create-many.repository'

export default class OAuth2Factory extends BaseFactory<IOAuth2Entity> {
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
    const createRepository = new CreateRepository(this.dbConnection)
    return await createRepository.handle(this.makeOne())
  }

  async createMany(count: number) {
    const createManyRepository = new CreateManyRepository(this.dbConnection)
    return await createManyRepository.handle(this.makeMany(count))
  }
}
