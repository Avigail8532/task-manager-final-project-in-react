import TaskModel from '../models/Task'
import { Types } from 'mongoose'
import { TASK_PRIORITIES, TASK_STATUSES, TaskInput } from '../types/task'
import { AppError } from '../utils/AppError'

export const getTaskModuleInfo = () => {
  return {
    message: 'Task routes are initialized. CRUD endpoints will be added in next stage.',
    allowedStatuses: TASK_STATUSES,
    allowedPriorities: TASK_PRIORITIES,
    modelName: TaskModel.modelName,
  }
}

const validateObjectId = (id: string): void => {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid task id format.', 400)
  }
}

export const getAllTasks = async () => {
  return TaskModel.find().sort({ createdAt: -1 })
}

export const getTaskById = async (id: string) => {
  validateObjectId(id)

  const task = await TaskModel.findById(id)

  if (!task) {
    throw new AppError('Task not found.', 404)
  }

  return task
}

export const createTask = async (payload: TaskInput) => {
  return TaskModel.create(payload)
}

export const updateTask = async (id: string, payload: Partial<TaskInput>) => {
  validateObjectId(id)

  const task = await TaskModel.findById(id)
  if (!task) {
    throw new AppError('Task not found.', 404)
  }

  const updatedTask = await TaskModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })

  if (!updatedTask) {
    throw new AppError('Task not found.', 404)
  }

  return updatedTask
}

export const deleteTask = async (id: string) => {
  validateObjectId(id)

  const deletedTask = await TaskModel.findByIdAndDelete(id)

  if (!deletedTask) {
    throw new AppError('Task not found.', 404)
  }
}
