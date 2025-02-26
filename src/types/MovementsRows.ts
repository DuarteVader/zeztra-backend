import { IMovementsDocument } from '../models/movements.model'

export type MovementsRows = {
  total: number
  items: IMovementsDocument[]
  page: number
  perPage: number
}
