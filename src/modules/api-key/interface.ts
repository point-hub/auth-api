export interface IApiKeyEntity {
  _id?: string
  user_id?: string
  name?: string
  api_key?: string
  scopes?: string[]
  created_date?: Date
  updated_date?: Date
}
