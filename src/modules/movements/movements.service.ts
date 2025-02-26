import { ObjectId } from 'mongoose'
import { AppError } from '../../errors/AppError'
import { IMovementsDocument, Movements } from '../../models/movements.model'
import { Users } from '../../models/users.model'
import { MovementsRows } from '../../types/MovementsRows'
import { performance } from 'perf_hooks'

type CreateMovementsDTO = {
  id: string
  nome: string
  cpfCnpj: string
  data: string
  valor: string
}

class MovementsService {
  constructor() {}

  async createMovements(data: CreateMovementsDTO[]): Promise<void> {
    const startTime = performance.now()

    try {
      console.log('Iniciando criação de movimentações')

      const userCache = new Map<string, ObjectId>()

      const cpfsCnpjs = data.map((movement) => movement.cpfCnpj)
      const users = await Users.find({ cpfCnpj: { $in: cpfsCnpjs } })

      users.forEach((user: any) => {
        userCache.set(user.cpfCnpj, user._id)
      })

      const bulkOperations = data.map((movement: CreateMovementsDTO) => {
        let userId = userCache.get(movement.cpfCnpj)

        if (!userId) {
          const newUser = new Users({
            nome: movement.nome,
            cpfCnpj: movement.cpfCnpj,
          })
          userId = newUser._id as any
          userCache.set(movement.cpfCnpj, userId)
          newUser.save()
        }

        return {
          updateOne: {
            filter: { uuid: movement.id },
            update: {
              $setOnInsert: {
                uuid: movement.id,
                nome: movement.nome,
                cpfCnpj: movement.cpfCnpj,
                data: movement.data,
                valor: movement.valor,
                user: userId,
              },
            },
            upsert: true,
          },
        }
      })

      await Movements.bulkWrite(bulkOperations)
    } catch (error) {
      throw new AppError('Erro ao criar movimentações', 400)
    } finally {
      const endTime = performance.now()
      console.log(
        `Tempo para registrar documentos: ${
          (endTime - startTime) / 60000
        } minutos`
      )
    }
  }

  async getMovements(
    page: number,
    perPage: number,
    q: string,
    rangeDates?: any
  ): Promise<MovementsRows> {

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

    if(rangeDates) {
      filter = {
        ...filter,
        data: {
          $gte: rangeDates.start,
          $lte: rangeDates.end
        }
      }
    }

    const movements = await Movements.find(filter)
      .skip((page - 1) * maximumItemsPerPage)
      .limit(maximumItemsPerPage)
      .sort({ nome: 1 })

    const total = await Movements.countDocuments(filter)

    return {
      items: movements,
      total,
      page,
      perPage,
    }
  }
}

export { MovementsService }
