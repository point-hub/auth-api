export interface ICustomerEntity {
  _id?: string
  name?: string
  age?: number
  nationality?: ICustomerNationality
  notes?: string
  created_at?: Date
  updated_at?: Date
}

export interface ICustomerNationality {
  label?: string
  value?: string
}
