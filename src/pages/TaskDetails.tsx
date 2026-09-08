import { useEffect, useState } from 'react'
import { Alert, Button, Card, CardContent, CircularProgress, Stack, Typography } from '@mui/material'
import { AxiosError } from 'axios'
import { Link, useParams } from 'react-router-dom'
import { getTaskById } from '../services/taskService'
import type { Task } from '../types/task'

function TaskDetails() {
  const { id } = useParams<{ id: string }>()
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTask = async () => {
      if (!id) {
        setError('Task id is missing.')
        setLoading(false)
        return
      }

      try {
        const data = await getTaskById(id)
        setTask(data)
      } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>
        const backendMessage = axiosError.response?.data?.message
        const statusCode = axiosError.response?.status

        if (statusCode === 404) {
          setError('Task not found.')
        } else if (statusCode === 400) {
          setError('Invalid task id.')
        } else {
          setError(backendMessage ?? 'Failed to load task details. Please try again.')
        }
      } finally {
        setLoading(false)
      }
    }

    void fetchTask()
  }, [id])

  if (loading) {
    return (
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <CircularProgress size={24} />
        <Typography>Loading task details...</Typography>
      </Stack>
    )
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>
  }

  if (!task) {
    return <Typography>Task not found.</Typography>
  }

  return (
    <Card variant="outlined" sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Task Details
        </Typography>
        <Typography sx={{ mb: 1 }}>
          <strong>Title:</strong> {task.title}
        </Typography>
        <Typography sx={{ mb: 1 }}>
          <strong>Description:</strong> {task.description}
        </Typography>
        <Typography sx={{ mb: 1 }}>
          <strong>Status:</strong> {task.status}
        </Typography>
        <Typography sx={{ mb: 1 }}>
          <strong>Priority:</strong> {task.priority}
        </Typography>
        <Typography sx={{ mb: 1 }}>
          <strong>Category:</strong> {task.category}
        </Typography>
        <Typography>
          <strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}
        </Typography>
        <Button component={Link} to="/tasks" sx={{ mt: 2 }} variant="outlined">
          Back to Tasks
        </Button>
      </CardContent>
    </Card>
  )
}

export default TaskDetails
