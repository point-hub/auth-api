import { DatabaseTestUtil } from '@point-hub/papi'
import { beforeAll, beforeEach, describe, expect, it } from 'bun:test'
import type { Express } from 'express'
import request from 'supertest'

import { createApp } from '@/app'

import CustomerFactory from '../factory'

describe('delete many customers', async () => {
  let app: Express
  beforeAll(async () => {
    app = await createApp({ dbConnection: DatabaseTestUtil.dbConnection })
  })
  beforeEach(async () => {
    await DatabaseTestUtil.reset()
  })
  it('delete success', async () => {
    const customerFactory = new CustomerFactory(DatabaseTestUtil.dbConnection)
    const resultFactory = await customerFactory.createMany(3)

    const response = await request(app)
      .post('/v1/customers/delete-many')
      .send({
        ids: [resultFactory.inserted_ids[0], resultFactory.inserted_ids[1]],
      })

    // expect http response
    expect(response.statusCode).toEqual(200)

    // expect response json
    expect(response.body).toStrictEqual({ deleted_count: 2 })

    // expect recorded data
    const customerRecord1 = await DatabaseTestUtil.retrieve('customers', resultFactory.inserted_ids[0])
    expect(customerRecord1).toBeNull()
    const customerRecord2 = await DatabaseTestUtil.retrieve('customers', resultFactory.inserted_ids[1])
    expect(customerRecord2).toBeNull()

    const customerRecords = await DatabaseTestUtil.retrieveAll('customers')
    expect(customerRecords.data.length).toStrictEqual(1)
  })
})
