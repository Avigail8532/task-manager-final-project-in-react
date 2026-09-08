import { useEffect, useMemo, useState } from 'react'
import { Alert, Card, CardContent, CircularProgress, Grid, Stack, Typography } from '@mui/material'
import { getTasks } from '../services/taskService'
import type { Task } from '../types/task'

function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks()
        setTasks(data)
      } catch (_err) {
        setError('Failed to load dashboard summary.')
      } finally {
        setLoading(false)
      }
    }

    void fetchTasks()
  }, [])

  const stats = useMemo(() => {
    const completed = tasks.filter((task) => task.status === 'completed').length
    const inProgress = tasks.filter((task) => task.status === 'in-progress').length
    const pending = tasks.filter((task) => task.status === 'todo').length
    const highPriority = tasks.filter((task) => task.priority === 'high').length

    return {
      total: tasks.length,
      completed,
      inProgress,
      pending,
      highPriority,
    }
  }, [tasks])

  if (loading) {
    return (
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <CircularProgress size={24} />
        <Typography>Loading dashboard...</Typography>
      </Stack>
    )
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Dashboard</Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography color="text.secondary">Total Tasks</Typography>
              <Typography variant="h5">{stats.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography color="text.secondary">Completed</Typography>
              <Typography variant="h5">{stats.completed}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography color="text.secondary">In Progress</Typography>
              <Typography variant="h5">{stats.inProgress}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography color="text.secondary">Pending</Typography>
              <Typography variant="h5">{stats.pending}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography color="text.secondary">High Priority</Typography>
              <Typography variant="h5">{stats.highPriority}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  )
}

export default Dashboard
