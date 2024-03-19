export interface IApplicationEntity {
  _id?: string
  name?: string
  logo?: string
  website?: string
  privacy_link?: string
  terms_link?: string
  authorized_domain?: string[]
  developer_email?: string[]
  support_email?: string
  created_by?: string
  updated_by?: string
  created_date?: Date
  updated_date?: Date
}
