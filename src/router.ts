import express, { type Express, type Request, type Response } from 'express'

import type { IBaseAppInput } from './app'
import clientRouter from './modules/clients/router'
import exampleRouter from './modules/examples/router'
import moduleExampleRouter from './modules/module-examples/router'
import userRouter from './modules/users/router'
import authRouter from './modules/users/router-auth'
import { renderHbsTemplate } from './utils/email'

export default async function (baseRouterInput: IBaseAppInput) {
  const app: Express = express()

  /**
   * Register all available modules
   * <modules>/router.ts
   */
  app.use('/v1/users', await userRouter(baseRouterInput))
  app.use('/v1/auth', await authRouter(baseRouterInput))
  app.use('/v1/clients', await clientRouter(baseRouterInput))
  app.use('/v1/examples', await exampleRouter(baseRouterInput))
  app.use('/v1/module-examples', await moduleExampleRouter(baseRouterInput))

  /**
   * Rendered email templates
   *
   * @example
   * Access this in your browser using the following path:
   * /templates/modules/examples/emails/example
   */
  app.get('/templates/*param', async (req: Request, res: Response) => {
    const params = Array.isArray(req.params['param']) ? req.params['param'].join('/') : req.params['param']
    const html = await renderHbsTemplate(`${params}.hbs`)
    res.send(html)
  })

  return app
}
