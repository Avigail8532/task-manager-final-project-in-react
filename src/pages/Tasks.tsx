import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material'
import { getTasks } from '../services/taskService'
import type { Task } from '../types/task'

function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks()
        setTasks(data)
      } catch (_err) {
        setError('Failed to load tasks. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    void fetchTasks()
  }, [])

  if (loading) {
    return (
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <CircularProgress size={24} />
        <Typography>Loading tasks...</Typography>
      </Stack>
    )
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>
  }

  if (tasks.length === 0) {
    return <Typography>No tasks yet.</Typography>
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Tasks
      </Typography>
      <Stack spacing={2}>
        {tasks.map((task) => (
          <Card key={task.id} variant="outlined">
            <CardContent>
              <Typography variant="h6">{task.title}</Typography>
              <Typography color="text.secondary" sx={{ mb: 1 }}>
                {task.description}
              </Typography>
              <Stack direction="row" spacing={1} useFlexGap sx={{ mb: 1, flexWrap: 'wrap' }}>
                <Chip label={`Status: ${task.status}`} size="small" />
                <Chip label={`Priority: ${task.priority}`} size="small" />
                <Chip label={`Category: ${task.category}`} size="small" />
              </Stack>
              <Typography variant="body2">
                Due Date: {new Date(task.dueDate).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  )
}

export default Tasks
