import api from './api'
import type { Task } from '../types/task'

interface ApiResponse<T> {
  success: boolean
  data: T
}

export const getTasks = async (): Promise<Task[]> => {
  const response = await api.get<ApiResponse<Task[]>>('/api/tasks')
  return response.data.data
}
