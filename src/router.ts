import express, { Express } from 'express'

import { IBaseAppInput } from './app'
import apiKeyRouter from './modules/api-key/router'
import applicationRouter from './modules/application/router'
import oauthClientRouter from './modules/oauth-client/router'
import userRouter from './modules/user/router'
import authRouter from './modules/user/router-auth'

export default async function (baseRouterInput: IBaseAppInput) {
  const app: Express = express()

  /**
   * Register all available modules
   * <modules>/router.ts
   */
  app.use('/v1/users', await userRouter(baseRouterInput))
  app.use('/v1/auth', await authRouter(baseRouterInput))
  app.use('/v1/oauth-clients', await oauthClientRouter(baseRouterInput))
  app.use('/v1/api-keys', await apiKeyRouter(baseRouterInput))
  app.use('/v1/applications', await applicationRouter(baseRouterInput))

  return app
}
