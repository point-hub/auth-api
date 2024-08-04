export interface IUserEntity {
  _id?: string
  name?: string
  username?: string
  trimmed_username?: string // for checking unique username by ignoring spaces
  email?: string
  trimmed_email?: string // for checking unique email by ignoring dot and +
  email_verification_code?: string
  is_email_verified?: boolean
  password?: string
  created_date?: Date
  updated_date?: Date
  oauth?: {
    /**
     * "id": "102430345574650586478",
    "email": "martiendt@gmail.com",
    "verified_email": true,
    "name": "Martien Dermawan",
    "given_name": "Martien",
    "family_name": "Dermawan",
    "picture": "https://lh3.googleusercontent.com/a/ACg8ocKzIKaXwWTtOxtg7ELdY6KUE-XnD8MwbH6PfTEBaonRYBr-_6xO=s96-c"
     */
    google?: {
      token_type?: string
      access_token?: string
      refresh_token?: string
    }
    github?: {
      token_type?: string
      access_token?: string
      refresh_token?: string
    }
  }
}

export interface IUserToken {
  application_id?: string
  user_id?: string
  access_token?: string
  refresh_token?: string
}
