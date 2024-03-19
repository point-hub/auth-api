import { BaseErrorHandler, type TypeCodeStatus } from '@point-hub/papi'

export const throwApiError = (codeStatus: TypeCodeStatus, message?: string, errors?: object) => {
  throw new BaseErrorHandler.ApiError(codeStatus, message, errors)
}
