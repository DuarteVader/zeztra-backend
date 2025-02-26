import { Users } from '../../models/users.model'
import { UsersRows } from '../../types/UsersRows'

class MovementsService {
  constructor() {}

  async getMovements(
    page: number,
    perPage: number,
    q: string
  ): Promise<UsersRows> {
    let maximumItemsPerPage = 50

    if (perPage >= maximumItemsPerPage) {
      maximumItemsPerPage = 50
    } else {
      maximumItemsPerPage = perPage
    }

    let filter = {}

    if (q !== String(undefined)) {
      filter = {
        ...filter,
        $or: [{ nome: { $regex: q, $options: 'i' } }],
      }
    }

    const users = await Users.find(filter)
      .skip((page - 1) * maximumItemsPerPage)
      .limit(maximumItemsPerPage)
      .sort({ nome: 1 })

    const total = await Users.countDocuments(filter)

    return {
      items: users,
      total,
      page,
      perPage,
    }
  }
}

export { MovementsService }
