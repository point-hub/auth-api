import { Router } from 'express'

import { type IBaseAppInput } from '@/app'
import { makeController } from '@/express'

import * as controller from './controllers/index'

const makeRouter = async (routerInput: IBaseAppInput) => {
  const router = Router()

  router.post(
    '/',
    await makeController({
      controller: controller.createClientController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  router.get(
    '/',
    await makeController({
      controller: controller.retrieveAllClientController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  router.get(
    '/:id',
    await makeController({
      controller: controller.retrieveClientController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  router.patch(
    '/:id',
    await makeController({
      controller: controller.updateClientController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  router.delete(
    '/:id',
    await makeController({
      controller: controller.deleteClientController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  router.post(
    '/create-many',
    await makeController({
      controller: controller.createManyClientController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  router.post(
    '/update-many',
    await makeController({
      controller: controller.updateManyClientController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  router.post(
    '/delete-many',
    await makeController({
      controller: controller.deleteManyClientController,
      dbConnection: routerInput.dbConnection,
    }),
  )

  return router
}

export default makeRouter
