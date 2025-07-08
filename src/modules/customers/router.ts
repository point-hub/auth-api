import { Router } from 'express'

import { type IBaseAppInput } from '@/app'
import { makeController } from '@/express'

import * as controller from './controllers/index'

const makeRouter = async (routerInput: IBaseAppInput) => {
  const router = Router()

  router.post(
    '/',
    await makeController({
      controller: controller.createCustomerController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  router.get(
    '/',
    await makeController({
      controller: controller.retrieveAllCustomerController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  router.get(
    '/:id',
    await makeController({
      controller: controller.retrieveCustomerController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  router.patch(
    '/:id',
    await makeController({
      controller: controller.updateCustomerController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  router.delete(
    '/:id',
    await makeController({
      controller: controller.deleteCustomerController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  router.post(
    '/create-many',
    await makeController({
      controller: controller.createManyCustomerController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  router.post(
    '/update-many',
    await makeController({
      controller: controller.updateManyCustomerController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  router.post(
    '/delete-many',
    await makeController({
      controller: controller.deleteManyCustomerController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  router.post(
    '/transaction',
    await makeController({
      controller: controller.transactionCustomerController,
      dbConnection: routerInput.dbConnection,
    }),
  )

  return router
}

export default makeRouter
