export const signupValidation = {
  pointhubSecret: ['required', 'string'],
  'data.name': ['required', 'string', 'min:5'],
  'data.username': ['required', 'string', 'min:5'],
  'data.email': ['required', 'string', 'email'],
  'data.password': ['required', 'string', 'min:5', 'password'],
}
