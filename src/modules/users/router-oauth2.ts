import { Router } from 'express'

import { IBaseAppInput } from '@/app'
import { makeController } from '@/express'

import * as controller from './controllers/index'

const makeRouter = async (routerInput: IBaseAppInput): Promise<Router> => {
  const router = Router()

  router.post(
    '/signin',
    await makeController({
      controller: controller.signinController,
      dbConnection: routerInput.dbConnection,
    }),
  )

  router.post(
    '/exchange-code',
    await makeController({
      controller: controller.signinController,
      dbConnection: routerInput.dbConnection,
    }),
  )

  router.get(
    '/callback',
    await makeController({
      controller: controller.oAuth2CallbackController,
      dbConnection: routerInput.dbConnection,
    }),
  )

  return router
}

export default makeRouter
