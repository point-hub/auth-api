export interface IOauthClientEntity {
  _id?: string
  user_id?: string
  name?: string
  client_id?: string
  client_secret?: string
  authorized_javascript_origins?: string[]
  authorized_redirect_urls?: string[]
  created_date?: Date
  updated_date?: Date
}
