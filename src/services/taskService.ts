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

export const getTaskById = async (id: string): Promise<Task> => {
  const response = await api.get<ApiResponse<Task>>(`/api/tasks/${id}`)
  return response.data.data
}

export const createTask = async (payload: CreateTaskPayload): Promise<Task> => {
  const response = await api.post<ApiResponse<Task>>('/api/tasks', payload)
  return response.data.data
}

export const updateTask = async (
  id: string,
  payload: CreateTaskPayload,
): Promise<Task> => {
  const response = await api.put<ApiResponse<Task>>(`/api/tasks/${id}`, payload)
  return response.data.data
}

export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`/api/tasks/${id}`)
}
