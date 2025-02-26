import { Router } from 'express'
import { MovementsController } from './movements.controller'
import multer from 'multer'

const routes = Router()
const upload = multer({ storage: multer.memoryStorage() })

const movementsController = new MovementsController()

routes.post(
  '/movements',
  upload.single('file'),
  (req, res) => movementsController.createMovements(req, res)
)

routes.get('/movements', (req, res) =>
  movementsController.getMovements(req, res)
)

export default routes
