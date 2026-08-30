import { Request, Response } from 'express'
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  getTaskModuleInfo,
  updateTask,
} from '../services/taskService'
import { asyncHandler } from '../utils/asyncHandler'
import { AppError } from '../utils/AppError'

export const getTaskInfrastructureInfo = (_req: Request, res: Response) => {
  const info = getTaskModuleInfo()
  res.status(200).json({ success: true, data: info })
}

const getTaskIdParam = (req: Request): string => {
  const id = req.params.id
  if (typeof id !== 'string') {
    throw new AppError('Invalid task id format.', 400)
  }
  return id
}

export const getTasks = asyncHandler(async (_req, res) => {
  const tasks = await getAllTasks()
  res.status(200).json({ success: true, data: tasks })
})

export const getTask = asyncHandler(async (req, res) => {
  const task = await getTaskById(getTaskIdParam(req))
  res.status(200).json({ success: true, data: task })
})

export const postTask = asyncHandler(async (req, res) => {
  const createdTask = await createTask(req.body)
  res.status(201).json({ success: true, data: createdTask })
})

export const putTask = asyncHandler(async (req, res) => {
  const updatedTask = await updateTask(getTaskIdParam(req), req.body)
  res.status(200).json({ success: true, data: updatedTask })
})

export const removeTask = asyncHandler(async (req, res) => {
  await deleteTask(getTaskIdParam(req))
  res.status(200).json({ success: true, data: { message: 'Task deleted successfully.' } })
})
