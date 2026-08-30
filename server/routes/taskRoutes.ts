import { Router } from 'express'
import {
  getTask,
  getTaskInfrastructureInfo,
  getTasks,
  postTask,
  putTask,
  removeTask,
} from '../controllers/taskController'

const taskRoutes = Router()

// Infrastructure-only endpoint for Stage 2 (no CRUD yet).
taskRoutes.get('/info', getTaskInfrastructureInfo)
taskRoutes.get('/', getTasks)
taskRoutes.get('/:id', getTask)
taskRoutes.post('/', postTask)
taskRoutes.put('/:id', putTask)
taskRoutes.delete('/:id', removeTask)

export default taskRoutes
