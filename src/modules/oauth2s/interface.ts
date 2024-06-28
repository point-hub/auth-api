export interface IOAuth2Entity {
  _id?: string
  application_type?: string
  name?: string
  client_id?: string
  client_secret?: string
  prefix_client_secret?: string
  authorized_urls?: string[]
  redirect_urls?: string[]
  created_date?: Date
  updated_date?: Date
}
