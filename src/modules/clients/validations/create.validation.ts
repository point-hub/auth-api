/**
 * Available rules
 * https://github.com/mikeerickson/validatorjs?tab=readme-ov-file#available-rules
 */

export const createValidation = {
  name: ['required', 'string'],
  authorized_origins: 'array',
  'authorized_origins.*': 'string',
}
