import { Router } from 'express'

import { IBaseAppInput } from '@/app'
import { makeController } from '@/express'

import * as controller from './controllers/index'

const makeRouter = async (routerInput: IBaseAppInput) => {
  const router = Router()

  router.post(
    '/signup',
    await makeController({
      controller: controller.signupController,
      dbConnection: routerInput.dbConnection,
    }),
  )

  router.post(
    '/signin',
    await makeController({
      controller: controller.signinController,
      dbConnection: routerInput.dbConnection,
    }),
  )

  router.post(
    '/existing-email',
    await makeController({
      controller: controller.retrieveExistingEmailController,
      dbConnection: routerInput.dbConnection,
    }),
  )

  router.post(
    '/existing-username',
    await makeController({
      controller: controller.retrieveExistingUsernameController,
      dbConnection: routerInput.dbConnection,
    }),
  )

  router.post(
    '/verify-email',
    await makeController({
      controller: controller.verifyEmailController,
      dbConnection: routerInput.dbConnection,
    }),
  )

  router.post(
    '/google',
    await makeController({
      controller: controller.googleAuthController,
      dbConnection: routerInput.dbConnection,
    }),
  )

  router.get(
    '/google/callback',
    await makeController({
      controller: controller.googleAuthCallbackController,
      dbConnection: routerInput.dbConnection,
    }),
  )

  router.post(
    '/github',
    await makeController({
      controller: controller.githubAuthController,
      dbConnection: routerInput.dbConnection,
    }),
  )

  router.get(
    '/github/callback',
    await makeController({
      controller: controller.githubAuthCallbackController,
      dbConnection: routerInput.dbConnection,
    }),
  )

  return router
}

export default makeRouter
