import { Request, Response } from 'express'
import { MovementsService } from './movements.service'
import { AppError } from '../../errors/AppError'

class MovementsController {
  private movementsService: MovementsService

  constructor() {
    this.movementsService = new MovementsService()
  }

  async createMovements(req: Request, res: Response) {
    try {
      if (!req.file) {
        throw new AppError('Arquivo não enviado', 400)
      }

      const fileContent = req.file.buffer.toString('utf-8')
      const jsonData = this.processTxtToJson(fileContent)

      await this.movementsService.createMovements(jsonData)

      return res
        .status(201)
        .json({ message: 'Movimentações criadas com sucesso' })
    } catch (error) {
      throw new AppError('Erro ao criar movimentação', 400)
    }
  }

  async getMovements(req: Request, res: Response) {
    const { page, perPage, q, rangeDates } = req.query

    let movements

      if (page && perPage) {
        movements = await this.movementsService.getMovements(
          +page,
          +perPage,
          String(q),
          rangeDates
        )
      }

    return res.status(200).json({ movements })
  }

  private processTxtToJson(fileContent: string) {
    const lines = fileContent
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line)

    return lines.map((line) => {
      const fields = line.split(';').filter((field) => field)
      const obj: any = {}
      fields.forEach((field) => {
        const [key, value] = field.split(':')
        obj[key] = value
      })
      return obj
    })
  }
}

export { MovementsController }
