import { tokenGenerate } from '@point-hub/express-utils'
import type { IDatabase, IDocument } from '@point-hub/papi'

import apiConfig from '@/config/api'

const generateLink = () => {
  const token = tokenGenerate()

  return `${apiConfig.clientUrl}/reset-password/${token}`
}

export interface IGenerateResetPassword {
  handle(document: IDocument): Promise<string>
}

export class GenerateResetPassword implements IGenerateResetPassword {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(document: IDocument): Promise<string> {
    const link = generateLink()
    await this.database.collection('users').update(
      document['_id'],
      {
        $set: {
          request_password_at: new Date(),
          reset_password_link: link,
        },
      },
      { ignoreUndefined: true, ...this.options },
    )

    return `${link}`
  }
}
