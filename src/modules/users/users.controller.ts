import { Request, Response } from 'express'
import { MovementsService } from './users.service'
import { AppError } from '../../errors/AppError'


class UsersController {
  private movementsService: MovementsService

  constructor() {
    this.movementsService = new MovementsService()
  }

  async getUsers(req: Request, res: Response) {
    const { page, perPage, q } = req.query

    let users

      if (page && perPage) {
        users = await this.movementsService.getMovements(
          +page,
          +perPage,
          String(q),
        )
      }

    return res.status(200).json({ users })
  }

}

export { UsersController }
