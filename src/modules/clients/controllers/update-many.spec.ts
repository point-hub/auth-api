import { DatabaseTestUtil } from '@point-hub/papi'
import { beforeAll, beforeEach, describe, expect, it } from 'bun:test'
import { isValid } from 'date-fns'
import type { Express } from 'express'
import request from 'supertest'

import { createApp } from '@/app'

import ClientFactory from '../factory'

describe('update many clients', async () => {
  let app: Express
  beforeAll(async () => {
    app = await createApp({ dbConnection: DatabaseTestUtil.dbConnection })
  })
  beforeEach(async () => {
    await DatabaseTestUtil.reset()
  })
  it('update success', async () => {
    const clientFactory = new ClientFactory(DatabaseTestUtil.dbConnection)
    const clientData = [
      {
        phone: '',
      },
      {
        phone: '',
      },
      {
        phone: '12345678',
      },
    ]
    clientFactory.sequence(clientData)
    const resultFactory = await clientFactory.createMany(3)

    // suspend every client data with name robot
    const response = await request(app)
      .post('/v1/clients/update-many')
      .send({
        filter: {
          phone: '',
        },
        data: {
          phone: '11223344',
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
    const clientRecord1 = await DatabaseTestUtil.retrieve('clients', resultFactory.inserted_ids[0])
    expect(clientRecord1['phone']).toStrictEqual('11223344')
    expect(isValid(new Date(clientRecord1['updated_date'] as string))).toBeTruthy()

    const clientRecord2 = await DatabaseTestUtil.retrieve('clients', resultFactory.inserted_ids[1])
    expect(clientRecord2['phone']).toStrictEqual('11223344')
    expect(isValid(new Date(clientRecord2['updated_date'] as string))).toBeTruthy()

    // expect unmodified data
    const clientRecord3 = await DatabaseTestUtil.retrieve('clients', resultFactory.inserted_ids[2])
    expect(clientRecord3['phone']).toStrictEqual('12345678')
    expect(isValid(new Date(clientRecord3['updated_date'] as string))).toBeFalsy()
  })
})
