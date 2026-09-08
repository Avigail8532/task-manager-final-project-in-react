import { createContext, useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { getTasks } from '../services/taskService'
import type { Task } from '../types/task'

interface TasksContextValue {
  tasks: Task[]
  loading: boolean
  error: string | null
  loadTasks: () => Promise<void>
  addTask: (task: Task) => void
  updateTaskInState: (task: Task) => void
  removeTaskFromState: (taskId: string) => void
}

export const TasksContext = createContext<TasksContextValue | undefined>(undefined)

interface TasksProviderProps {
  children: ReactNode
}

export function TasksProvider({ children }: TasksProviderProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadTasks = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await getTasks()
      setTasks(data)
    } catch (_err) {
      setError('Failed to load tasks. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  const addTask = (task: Task) => {
    setTasks((prev) => [task, ...prev])
  }

  const updateTaskInState = (updatedTask: Task) => {
    setTasks((prev) => prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
  }

  const removeTaskFromState = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
  }

  useEffect(() => {
    void loadTasks()
  }, [loadTasks])

  return (
    <TasksContext.Provider
      value={{ tasks, loading, error, loadTasks, addTask, updateTaskInState, removeTaskFromState }}
    >
      {children}
    </TasksContext.Provider>
  )
}
