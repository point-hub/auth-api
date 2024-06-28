import express, { Express } from 'express'

import { IBaseAppInput } from './app'
import apiKeyRouter from './modules/api-keys/router'
import applicationRouter from './modules/applications/router'
import oauthClientRouter from './modules/oauth-client/router'
import oauth2Router from './modules/oauth2s/router'
import userRouter from './modules/users/router'
import authRouter from './modules/users/router-auth'

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
  app.use('/v1/oauth2s', await oauth2Router(baseRouterInput))
  app.use('/v1/applications', await applicationRouter(baseRouterInput))

  return app
}
