import { Router } from 'express'
import { UsersController } from './users.controller'

const routes = Router()

const usersController = new UsersController()

routes.get('/users', (req, res) => usersController.getUsers(req, res))

export default routes
