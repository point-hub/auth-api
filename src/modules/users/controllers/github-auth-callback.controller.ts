import { type IController, type IControllerInput } from '@point-hub/papi'

import githubConfig from '@/config/github'
import { Github } from '@/utils/github-auth'

export const githubAuthCallbackController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    // 3. handle business rules
    const qs = new URLSearchParams(controllerInput.httpRequest.query)
    const github = new Github()
    console.log(qs.get('code'))
    const response = await fetch(
      `https://github.com/login/oauth/access_token?client_id=${githubConfig.githubClientID}&client_secret=${
        githubConfig.githubClientSecret
      }&code=${qs.get('code')}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
    const z = await response.json()
    const response2 = await fetch(`https://api.github.com/user`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'token ' + z.access_token,
      },
    })
    const zx = await response2.json()
    await session.commitTransaction()
    // 4. return response to client
    return {
      status: 200,
      json: {
        z: z,
        userInfo: zx,
      },
    }
  } catch (error) {
    console.log(error)
    await session?.abortTransaction()
    throw error
  } finally {
    await session?.endSession()
  }
}
