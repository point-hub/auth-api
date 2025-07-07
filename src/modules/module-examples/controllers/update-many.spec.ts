import { DatabaseTestUtil } from '@point-hub/papi'
import { beforeAll, beforeEach, describe, expect, it } from 'bun:test'
import { isValid } from 'date-fns'
import type { Express } from 'express'
import request from 'supertest'

import { createApp } from '@/app'

import ModuleExampleFactory from '../factory'

describe('update many module_examples', async () => {
  let app: Express
  beforeAll(async () => {
    app = await createApp({ dbConnection: DatabaseTestUtil.dbConnection })
  })
  beforeEach(async () => {
    await DatabaseTestUtil.reset()
  })
  it('update success', async () => {
    const moduleExampleFactory = new ModuleExampleFactory(DatabaseTestUtil.dbConnection)
    const moduleExampleData = [
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
    moduleExampleFactory.sequence(moduleExampleData)
    const resultFactory = await moduleExampleFactory.createMany(3)

    const response = await request(app)
      .post('/v1/module-examples/update-many')
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
    const moduleExampleRecord1 = await DatabaseTestUtil.retrieve('module_examples', resultFactory.inserted_ids[0])
    expect(moduleExampleRecord1['phone']).toStrictEqual('11223344')
    expect(isValid(new Date(moduleExampleRecord1['updated_date'] as string))).toBeTruthy()

    const moduleExampleRecord2 = await DatabaseTestUtil.retrieve('module_examples', resultFactory.inserted_ids[1])
    expect(moduleExampleRecord2['phone']).toStrictEqual('11223344')
    expect(isValid(new Date(moduleExampleRecord2['updated_date'] as string))).toBeTruthy()

    // expect unmodified data
    const moduleExampleRecord3 = await DatabaseTestUtil.retrieve('module_examples', resultFactory.inserted_ids[2])
    expect(moduleExampleRecord3['phone']).toStrictEqual('12345678')
    expect(isValid(new Date(moduleExampleRecord3['updated_date'] as string))).toBeFalsy()
  })
})
