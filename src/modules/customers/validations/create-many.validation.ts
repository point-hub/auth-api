/**
 * Available rules
 * https://github.com/mikeerickson/validatorjs?tab=readme-ov-file#available-rules
 */

export const createManyValidation = {
  'customers.*.name': ['required', 'string'],
  'customers.*.age': ['required', 'integer', 'max:100', 'min:17'],
  'customers.*.nationality': ['required'],
  'customers.*.notes': ['string'],
}
