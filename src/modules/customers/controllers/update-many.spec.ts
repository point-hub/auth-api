import { faker } from '@faker-js/faker'
import { DatabaseTestUtil } from '@point-hub/papi'
import { beforeAll, beforeEach, describe, expect, it } from 'bun:test'
import { isValid } from 'date-fns'
import type { Express } from 'express'
import request from 'supertest'

import { createApp } from '@/app'

import CustomerFactory from '../factory'

describe('update many customers', async () => {
  let app: Express
  beforeAll(async () => {
    app = await createApp({ dbConnection: DatabaseTestUtil.dbConnection })
  })
  beforeEach(async () => {
    await DatabaseTestUtil.reset()
  })
  it('update success', async () => {
    const customerFactory = new CustomerFactory(DatabaseTestUtil.dbConnection)
    const customerData = [
      {
        name: faker.person.fullName(),
        age: 25,
        nationality: { label: 'Indonesia', value: 'ID' },
      },
      {
        name: faker.person.fullName(),
        age: 25,
        nationality: { label: 'Indonesia', value: 'ID' },
      },
      {
        name: faker.person.fullName(),
        age: 99,
        nationality: { label: 'Indonesia', value: 'ID' },
      },
    ]
    customerFactory.sequence(customerData)
    const resultFactory = await customerFactory.createMany(3)

    // suspend every customer data with name robot
    const response = await request(app)
      .post('/v1/customers/update-many')
      .send({
        filter: {
          age: 25,
        },
        data: {
          age: 30,
        },
      })
    // expect http response
    expect(response.statusCode).toEqual(200)

    // expect response json
    expect(response.body).toStrictEqual({
      matched_count: 2,
      modified_count: 2,
    })

    // expect recorded data
    const customerRecord1 = await DatabaseTestUtil.retrieve('customers', resultFactory.inserted_ids[0])
    expect(customerRecord1['age']).toStrictEqual(30)
    expect(isValid(new Date(customerRecord1['updated_at'] as string))).toBeTruthy()

    const customerRecord2 = await DatabaseTestUtil.retrieve('customers', resultFactory.inserted_ids[1])
    expect(customerRecord2['age']).toStrictEqual(30)
    expect(isValid(new Date(customerRecord2['updated_at'] as string))).toBeTruthy()

    // expect unmodified data
    const customerRecord3 = await DatabaseTestUtil.retrieve('customers', resultFactory.inserted_ids[2])
    expect(customerRecord3['age']).toStrictEqual(99)
    expect(isValid(new Date(customerRecord3['updated_at'] as string))).toBeFalsy()
  })
})
