import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { connectDatabase } from './config/database'
import { errorHandler } from './middleware/errorHandler'
import healthRoutes from './routes/healthRoutes'
import taskRoutes from './routes/taskRoutes'

const app = express()
const port = Number(process.env.PORT) || 5000

app.use(cors())
app.use(express.json())
app.use('/api', healthRoutes)
app.use('/api/tasks', taskRoutes)
app.use(errorHandler)

const startServer = async () => {
  try {
    await connectDatabase()
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`)
    })
  } catch (error) {
    console.error('Server startup failed:', error)
    process.exit(1)
  }
}

void startServer()
