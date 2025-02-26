import { log } from 'console'
import { app } from './app'
import { ConsoleColors } from './utils/ConsoleColors'
import { start } from './database'

const port = process.env.PORT

app.listen(port, () => {
  log(ConsoleColors.Green, `Server running on: ${process.env.APP_URL}.`)

  start()
})
