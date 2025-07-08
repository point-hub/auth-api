import { faker } from '@faker-js/faker'
import { DatabaseTestUtil } from '@point-hub/papi'
import { beforeAll, beforeEach, describe, expect, it } from 'bun:test'
import type { Express } from 'express'
import request from 'supertest'

import { createApp } from '@/app'

describe('customer use transaction', async () => {
  let app: Express
  beforeAll(async () => {
    app = await createApp({ dbConnection: DatabaseTestUtil.dbConnection })
  })
  beforeEach(async () => {
    await DatabaseTestUtil.reset()
  })
  it('transaction aborted when create failed', async () => {
    const data = {
      new: {
        name: 'John',
        age: faker.number.int({ min: 25, max: 99 }),
        nationality: { label: 'Indonesia', value: 'ID' },
      },
      create: {
        name: 'John',
        age: faker.number.int({ min: 25, max: 99 }),
        nationality: { label: 'Indonesia', value: 'ID' },
      },
    }

    await request(app).post('/v1/customers/transaction').send(data)

    // expect recorded data
    const customerRecords = await DatabaseTestUtil.retrieveAll('customers')
    expect(customerRecords.data.length).toStrictEqual(0)
  })
  it('transaction aborted when create many failed', async () => {
    const data = {
      new: {
        name: 'John',
        age: faker.number.int({ min: 25, max: 99 }),
        nationality: { label: 'Indonesia', value: 'ID' },
      },
      create: {
        name: 'John 2',
        age: faker.number.int({ min: 25, max: 99 }),
        nationality: { label: 'Indonesia', value: 'ID' },
      },
      createMany: {
        customers: [
          {
            name: 'John 2',
            age: faker.number.int({ min: 25, max: 99 }),
            nationality: { label: 'Indonesia', value: 'ID' },
          },
        ],
      },
    }

    await request(app).post('/v1/customers/transaction').send(data)

    // expect recorded data
    const customerRecords = await DatabaseTestUtil.retrieveAll('customers')
    expect(customerRecords.data.length).toStrictEqual(2)
  })
  it('transaction aborted when update failed', async () => {
    const data = {
      new: {
        name: 'John',
        age: faker.number.int({ min: 25, max: 99 }),
        nationality: { label: 'Indonesia', value: 'ID' },
      },
      create: {
        name: 'John 2',
        age: faker.number.int({ min: 25, max: 99 }),
        nationality: { label: 'Indonesia', value: 'ID' },
      },
      createMany: {
        customers: [
          {
            name: 'John 3',
            age: faker.number.int({ min: 25, max: 99 }),
            nationality: { label: 'Indonesia', value: 'ID' },
          },
        ],
      },
      update: {
        name: 'John 3',
      },
    }

    await request(app).post('/v1/customers/transaction').send(data)

    // expect recorded data
    const customerRecords = await DatabaseTestUtil.retrieveAll('customers')
    expect(customerRecords.data.length).toStrictEqual(3)
  })
  it('transaction aborted when update many failed', async () => {
    const data = {
      new: {
        name: 'John',
        age: faker.number.int({ min: 25, max: 99 }),
        nationality: { label: 'Indonesia', value: 'ID' },
      },
      create: {
        name: 'John 2',
        age: faker.number.int({ min: 25, max: 99 }),
        nationality: { label: 'Indonesia', value: 'ID' },
      },
      createMany: {
        customers: [
          {
            name: 'John 3',
            age: faker.number.int({ min: 25, max: 99 }),
            nationality: { label: 'Indonesia', value: 'ID' },
          },
          {
            name: 'John 4',
            age: faker.number.int({ min: 25, max: 99 }),
            nationality: { label: 'Indonesia', value: 'ID' },
          },
        ],
      },
      update: {
        name: 'John 5',
      },
      updateMany: {
        filter: {
          name: 'John 5',
        },
        data: {
          name: 'John 2',
        },
      },
    }

    await request(app).post('/v1/customers/transaction').send(data)

    // expect recorded data
    const customerRecords = await DatabaseTestUtil.retrieveAll('customers')
    expect(customerRecords.data.length).toStrictEqual(4)
    expect(customerRecords.data[0]['name']).toStrictEqual('John 5')
  })
  it('transaction aborted when delete failed', async () => {
    const data = {
      new: {
        name: 'John',
        age: faker.number.int({ min: 25, max: 99 }),
        nationality: { label: 'Indonesia', value: 'ID' },
      },
      create: {
        name: 'John 2',
        age: faker.number.int({ min: 25, max: 99 }),
        nationality: { label: 'Indonesia', value: 'ID' },
      },
      createMany: {
        customers: [
          {
            name: 'John 3',
            age: faker.number.int({ min: 25, max: 99 }),
            nationality: { label: 'Indonesia', value: 'ID' },
          },
          {
            name: 'John 4',
            age: faker.number.int({ min: 25, max: 99 }),
            nationality: { label: 'Indonesia', value: 'ID' },
          },
        ],
      },
      update: {
        name: 'John 5',
      },
      updateMany: {
        filter: {
          name: 'John 5',
        },
        data: {
          name: 'John',
        },
      },
      delete: false,
    }

    await request(app).post('/v1/customers/transaction').send(data)

    // expect recorded data
    const customerRecords = await DatabaseTestUtil.retrieveAll('customers')
    expect(customerRecords.data.length).toStrictEqual(4)
  })
  it('transaction aborted when delete many failed', async () => {
    const data = {
      new: {
        name: 'John',
        age: faker.number.int({ min: 25, max: 99 }),
        nationality: { label: 'Indonesia', value: 'ID' },
      },
      create: {
        name: 'John 2',
        age: faker.number.int({ min: 25, max: 99 }),
        nationality: { label: 'Indonesia', value: 'ID' },
      },
      createMany: {
        customers: [
          {
            name: 'John 3',
            age: faker.number.int({ min: 25, max: 99 }),
            nationality: { label: 'Indonesia', value: 'ID' },
          },
          {
            name: 'John 4',
            age: faker.number.int({ min: 25, max: 99 }),
            nationality: { label: 'Indonesia', value: 'ID' },
          },
        ],
      },
      update: {
        name: 'John 5',
      },
      updateMany: {
        filter: {
          name: 'John 5',
        },
        data: {
          name: 'John',
        },
      },
      delete: true,
      deleteMany: false,
    }

    await request(app).post('/v1/customers/transaction').send(data)

    // expect recorded data
    const customerRecords = await DatabaseTestUtil.retrieveAll('customers')
    expect(customerRecords.data.length).toStrictEqual(3)
  })
})
