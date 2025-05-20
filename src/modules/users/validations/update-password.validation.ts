/**
 * Available rules
 * https://github.com/mikeerickson/validatorjs?tab=readme-ov-file#available-rules
 */

export interface IValidation {
  [key: string]: string[]
}

export const updatePasswordValidation: IValidation = {
  password: ['required', 'string'],
}
