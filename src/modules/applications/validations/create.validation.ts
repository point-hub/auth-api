export const createValidation = {
  name: ['required', 'string'],
  support_email: ['required', 'string'],
  developer_email: ['required', 'string'],
  homepage_link: ['required', 'string'],
  privacy_link: ['required', 'string'],
  terms_link: ['required', 'string'],
  authorized_domains: ['required', 'array'],
}
