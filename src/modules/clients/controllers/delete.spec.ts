import { DatabaseTestUtil } from '@point-hub/papi'
import { beforeAll, beforeEach, describe, expect, it } from 'bun:test'
import type { Express } from 'express'
import request from 'supertest'

import { createApp } from '@/app'

import ClientFactory from '../factory'

describe('delete an client', async () => {
  let app: Express
  beforeAll(async () => {
    app = await createApp({ dbConnection: DatabaseTestUtil.dbConnection })
  })
  beforeEach(async () => {
    await DatabaseTestUtil.reset()
  })
  it('delete success', async () => {
    const clientFactory = new ClientFactory(DatabaseTestUtil.dbConnection)
    const resultFactory = await clientFactory.createMany(3)

    const response = await request(app).delete(`/v1/clients/${resultFactory.inserted_ids[1]}`)

    // expect http response
    expect(response.statusCode).toEqual(200)

    // expect response json
    expect(response.body).toStrictEqual({ deleted_count: 1 })

    // expect recorded data
    const clientRecord = await DatabaseTestUtil.retrieve('clients', resultFactory.inserted_ids[1])
    expect(clientRecord).toBeNull()

    const clientRecords = await DatabaseTestUtil.retrieveAll('clients')
    expect(clientRecords.data.length).toStrictEqual(2)
  })
})
