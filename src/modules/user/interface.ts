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
