/**
 * Available rules
 * https://github.com/mikeerickson/validatorjs?tab=readme-ov-file#available-rules
 */

export const createManyValidation = {
  'clients.*.name': ['required', 'string'],
  'clients.*.age': ['required', 'integer', 'max:100', 'min:17'],
  'clients.*.nationality': ['required'],
  'clients.*.notes': ['string'],
}
