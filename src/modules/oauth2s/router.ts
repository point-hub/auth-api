import { Router } from 'express'

import { IBaseAppInput } from '@/app'
import { makeController } from '@/express'

import * as controller from './controllers/index'

const makeRouter = async (routerInput: IBaseAppInput) => {
  const router = Router()

  router.post(
    '/',
    await makeController({
      controller: controller.createOAuth2Controller,
      dbConnection: routerInput.dbConnection,
    }),
  )
  router.get(
    '/',
    await makeController({
      controller: controller.retrieveAllOAuth2Controller,
      dbConnection: routerInput.dbConnection,
    }),
  )
  router.get(
    '/:id',
    await makeController({
      controller: controller.retrieveOAuth2Controller,
      dbConnection: routerInput.dbConnection,
    }),
  )
  router.patch(
    '/:id',
    await makeController({
      controller: controller.updateOAuth2Controller,
      dbConnection: routerInput.dbConnection,
    }),
  )
  router.patch(
    '/:id/regenerate',
    await makeController({
      controller: controller.regenerateOAuth2Controller,
      dbConnection: routerInput.dbConnection,
    }),
  )
  router.delete(
    '/:id',
    await makeController({
      controller: controller.deleteOAuth2Controller,
      dbConnection: routerInput.dbConnection,
    }),
  )

  return router
}

export default makeRouter
