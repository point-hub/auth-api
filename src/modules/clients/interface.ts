export interface IClientEntity {
  _id?: string
  name?: string
  client_id?: string
  client_secret?: string
  redirect_uris?: string[]
  user_id?: string
  created_at?: Date
  created_by?: string
  updated_at?: Date
  updated_by?: string
}

export interface IClientNationality {
  label?: string
  value?: string
}
