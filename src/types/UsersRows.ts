import { IUsersDocument } from "../models/users.model"

export type UsersRows = {
  total: number
  items: IUsersDocument[]
  page: number
  perPage: number
}
