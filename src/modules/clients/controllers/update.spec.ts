import { faker } from '@faker-js/faker'
import { DatabaseTestUtil } from '@point-hub/papi'
import { beforeAll, beforeEach, describe, expect, it } from 'bun:test'
import { isValid } from 'date-fns'
import type { Express } from 'express'
import request from 'supertest'

import { createApp } from '@/app'

import ClientFactory from '../factory'

describe('update an client', async () => {
  let app: Express
  beforeAll(async () => {
    app = await createApp({ dbConnection: DatabaseTestUtil.dbConnection })
  })
  beforeEach(async () => {
    await DatabaseTestUtil.reset()
  })
  it('validate schema', async () => {
    const resultFactory = await new ClientFactory(DatabaseTestUtil.dbConnection).create()

    const clients = await DatabaseTestUtil.retrieveAll('clients')

    const updateData = {
      name: true,
    }

    const response = await request(app).patch(`/v1/clients/${resultFactory.inserted_id}`).send(updateData)

    // expect http response
    expect(response.statusCode).toEqual(422)

    // expect response json
    expect(response.body.code).toStrictEqual(422)
    expect(response.body.status).toStrictEqual('Unprocessable Entity')
    expect(response.body.message).toStrictEqual(
      'The request was well-formed but was unable to be followed due to semantic errors.',
    )
    expect(response.body.errors).toStrictEqual({
      name: ['The name must be a string.'],
    })

    // expect data unmodified
    const unmodifiedClientRecord = await DatabaseTestUtil.retrieve('clients', resultFactory.inserted_id)
    expect(unmodifiedClientRecord['name']).toStrictEqual(clients.data[0]['name'])
    expect(unmodifiedClientRecord['updated_date']).toBeUndefined()
  })
  it('update success', async () => {
    const resultFactory = await new ClientFactory(DatabaseTestUtil.dbConnection).createMany(3)
    const clients = await DatabaseTestUtil.retrieveAll('clients')
    const updateData = {
      name: faker.person.fullName(),
    }
    const response = await request(app).patch(`/v1/clients/${resultFactory.inserted_ids[1]}`).send(updateData)
    console.log(response.status)
    // expect http response
    expect(response.statusCode).toEqual(200)
    // expect response json
    expect(response.body).toStrictEqual({
      matched_count: 1,
      modified_count: 1,
    })
    // expect recorded data
    const clientRecord = await DatabaseTestUtil.retrieve('clients', resultFactory.inserted_ids[1])
    expect(clientRecord['name']).toStrictEqual(updateData.name)
    expect(isValid(new Date(clientRecord['updated_date'] as string))).toBeTruthy()
    // expect another data unmodified
    const unmodifiedClientRecord = await DatabaseTestUtil.retrieve('clients', resultFactory.inserted_ids[0])
    expect(unmodifiedClientRecord['name']).toStrictEqual(clients.data[0]['name'])
    expect(unmodifiedClientRecord['updated_date']).toBeUndefined()
  })
})
