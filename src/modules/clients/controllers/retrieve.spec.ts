import { DatabaseTestUtil } from '@point-hub/papi'
import { beforeAll, beforeEach, describe, expect, it } from 'bun:test'
import { isValid } from 'date-fns'
import type { Express } from 'express'
import request from 'supertest'

import { createApp } from '@/app'

import ClientFactory from '../factory'

describe('retrieve an client', async () => {
  let app: Express
  beforeAll(async () => {
    app = await createApp({ dbConnection: DatabaseTestUtil.dbConnection })
  })
  beforeEach(async () => {
    await DatabaseTestUtil.reset()
  })
  it('retrieve success', async () => {
    const clientFactory = new ClientFactory(DatabaseTestUtil.dbConnection)
    const resultFactory = await clientFactory.createMany(3)

    const clients = await DatabaseTestUtil.retrieveAll('clients')

    const response = await request(app).get(`/v1/clients/${resultFactory.inserted_ids[1]}`)

    // expect http response
    expect(response.statusCode).toEqual(200)

    // expect response json
    expect(response.body._id).toBeDefined()
    expect(response.body.name).toStrictEqual(clients.data[1]['name'])
    expect(response.body.phone).toStrictEqual(clients.data[1]['phone'])
    expect(isValid(new Date(response.body.created_date))).toBeTruthy()
  })
})
