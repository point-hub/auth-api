export interface IOAuth2Entity {
  _id?: string
  user_id?: string
  name?: string
  prefix_api_key?: string
  hashed_api_key?: string
  scopes?: string[]
  web_restrictions?: string[]
  ip_address_restrictions?: string[]
  created_date?: Date
  updated_date?: Date
}
