export interface IClientEntity {
  _id?: string
  name?: string
  client_id?: string
  client_secret?: string
  authorized_origins?: string[]
  authorized_redirect_uris?: string[]
  state?: string
  scope?: string
  created_at?: Date
  updated_at?: Date
}
