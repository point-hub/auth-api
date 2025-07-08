import { DatabaseTestUtil } from '@point-hub/papi'
import { beforeAll, beforeEach, describe, expect, it } from 'bun:test'
import type { Express } from 'express'
import request from 'supertest'

import { createApp } from '@/app'

import CustomerFactory from '../factory'

describe('delete an customer', async () => {
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

    const response = await request(app).delete(`/v1/customers/${resultFactory.inserted_ids[1]}`)

    // expect http response
    expect(response.statusCode).toEqual(200)

    // expect response json
    expect(response.body).toStrictEqual({ deleted_count: 1 })

    // expect recorded data
    const customerRecord = await DatabaseTestUtil.retrieve('customers', resultFactory.inserted_ids[1])
    expect(customerRecord).toBeNull()

    const customerRecords = await DatabaseTestUtil.retrieveAll('customers')
    expect(customerRecords.data.length).toStrictEqual(2)
  })
})
