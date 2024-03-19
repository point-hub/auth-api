import { BaseErrorHandler, type IDocument, type ISchemaValidation } from '@point-hub/papi'
import Validatorjs from 'validatorjs'

import { registerValidationPassword } from './validation-password'

registerValidationPassword()

// https://github.com/mikeerickson/validatorjs
export const schemaValidation: ISchemaValidation = async (document: IDocument, schema: IDocument) => {
  const validation = new Validatorjs(document, schema)
  if (validation.fails()) {
    throw new BaseErrorHandler.ApiError(422, undefined, validation.errors.errors)
  }
}
