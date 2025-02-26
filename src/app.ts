import express, {
  json,
  NextFunction,
  Request,
  Response,
  urlencoded,
} from 'express'
import 'express-async-errors'
import path from 'path'
import { version } from '../package.json'
import { AppError } from './errors/AppError'
import cors from 'cors'
import routes from './routes'

const app = express()

app.use(cors({ origin: '*' }))

app.use(json())

app.use(urlencoded({ extended: true }))

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    name: 'Case-Backend-API',
    version,
    env: process.env.ENVIRONMENT,
  })
})

app.use('/', routes)

app.use((e: Error, req: Request, res: Response, next: NextFunction) => {
  if (e instanceof AppError) {
    return res.status(e.statusCode).json({ message: e.message })
  }

  return res.status(500).json({
    status: 'error',
    message: `Internal server error - ${e.message}`,
  })
})

export { app }
