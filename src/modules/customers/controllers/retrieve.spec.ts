import { DatabaseTestUtil } from '@point-hub/papi'
import { beforeAll, beforeEach, describe, expect, it } from 'bun:test'
import { isValid } from 'date-fns'
import type { Express } from 'express'
import request from 'supertest'

import { createApp } from '@/app'

import CustomerFactory from '../factory'

describe('retrieve an customer', async () => {
  let app: Express
  beforeAll(async () => {
    app = await createApp({ dbConnection: DatabaseTestUtil.dbConnection })
  })
  beforeEach(async () => {
    await DatabaseTestUtil.reset()
  })
  it('retrieve success', async () => {
    const customerFactory = new CustomerFactory(DatabaseTestUtil.dbConnection)
    const resultFactory = await customerFactory.createMany(3)

    const customers = await DatabaseTestUtil.retrieveAll('customers')

    const response = await request(app).get(`/v1/customers/${resultFactory.inserted_ids[1]}`)

    // expect http response
    expect(response.statusCode).toEqual(200)

    // expect response json
    expect(response.body._id).toBeDefined()
    expect(response.body.name).toStrictEqual(customers.data[1]['name'])
    expect(response.body.age).toStrictEqual(customers.data[1]['age'])
    expect(response.body.nationality).toStrictEqual(customers.data[1]['nationality'])
    expect(isValid(new Date(response.body.created_at))).toBeTruthy()
  })
})
