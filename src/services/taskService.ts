import api from './api'
import type { CreateTaskPayload, Task } from '../types/task'

interface ApiResponse<T> {
  success: boolean
  data: T
}

export const getTasks = async (): Promise<Task[]> => {
  const response = await api.get<ApiResponse<Task[]>>('/api/tasks')
  return response.data.data
}

export const createTask = async (payload: CreateTaskPayload): Promise<Task> => {
  const response = await api.post<ApiResponse<Task>>('/api/tasks', payload)
  return response.data.data
}
